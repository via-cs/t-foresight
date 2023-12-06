import {computed, makeAutoObservable, observable} from "mobx";
import {genContext, playerColors, updateGameData} from "../utils/game.js";
import {contextFactory, genRandomStrategies, getStratAttention} from "../utils/fakeData.js";
import api from "../api/api.js";

class Store {
    constructor() {
        // 此处是利用了MobX的监听机制，makeAutoObservable会按照以下规则，处理该类中定义的变量与函数
        // 1. 该类中的变量将被设置为observable，每当监听到变量改变，引用变量的视图将自动刷新
        // 3. 该类中的getter函数将被设置为computed数值缓存，即根据其他observable的变量计算出一个新的值；当依赖变量改变，缓存值将被重新计算
        // 2. 该类中的其他函数将被设置为action，只有action中修改变量会被监听，并触发computed值的重新计算

        // 此处的gameData额外设置为observable.shallow有两个原因。
        // 1. observable会监听整个hierarchical的结构，observable.shallow只会监听根部引用的改变，提高效率
        // 2. gameData导入后是不变的，因此没必要监听其内部元素变化
        makeAutoObservable(this, {gameData: observable.shallow});

        this.setDevMode(window.localStorage.getItem('dev') === 'true');
    }

    //region system
    /**
     * 系统状态，在执行一些费时的操作时，如果不希望用户在此期间和系统交互，可以设置waiting为true
     * @type {boolean}
     */
    waiting = false
    setWaiting = state => this.waiting = state;

    devMode = false
    setDevMode = dev => {
        this.devMode = dev;
        window.localStorage.setItem('dev', dev.toString());
    }

    mapStyle = 'colored'
    setMapStyle = style => this.mapStyle = style;

    get mapImage() {
        return {
            'colored': './map.jpeg',
            'sketch': './map_no_color.jpg'
        }[this.mapStyle] || './map.jpeg';
    }

    strategyViewDesign = 'matrix'
    changeStrategyDetailView = () => this.strategyViewDesign = (this.strategyViewDesign === 'matrix') ? 'storyline' : 'matrix';
    //endregion

    //region game context
    /**
     * Game gameData instance
     * @type {import('src/model/D2Data.d.ts').D2Data | null}
     */
    gameData = null;
    gameName = '';
    /**
     * Import gameData
     * @param {string} filename
     * @param {import('src/model/D2Data.d.ts').D2Data} gameData
     */
    setData = (filename, gameData) => {
        this.gameName = filename;
        this.gameData = updateGameData(gameData);
        this.focusOnPlayer(-1, -1);
        this.setFrame(0);
        this.clearPredictions();
        this.clearContextLimit();
    }

    /**
     * 从gameData中提取玩家名
     * @returns {string[][]}
     */
    get playerNames() {
        if (this.gameData === null) return [['', '', '', '', ''], ['', '', '', '', '']]
        return [
            this.gameData.gameInfo.radiant.players.map(p => p.hero),
            this.gameData.gameInfo.dire.players.map(p => p.hero),
        ]
    }

    /**
     * 从gameData中提取总的数据帧数
     * @returns {number}
     */
    get numFrames() {
        if (this.gameData === null) return 0;
        return this.gameData.gameRecords.length;
    }

    /**
     * 从gameData中提取第frame帧的玩家位置
     * @return {[number, number][][]} : the positions of 2*5 players
     */
    get playerPositions() {
        if (!this.gameData) return [
            new Array(5).fill(0).map(() => [0, 0]),
            new Array(5).fill(0).map(() => [0, 0])
        ]
        const curFrame = this.gameData.gameRecords[this.frame];
        return curFrame.heroStates.map(team =>
            team.map(player =>
                player.pos
            )
        )
    }

    /**
     * 从gameData中提取第frame帧的玩家存活状态
     * @return {boolean[][]}: life state of 2*5 players
     */
    get playerLifeStates() {
        if (!this.gameData) return [
            new Array(5).fill(false),
            new Array(5).fill(false),
        ]
        const curFrame = this.gameData.gameRecords[this.frame];
        return curFrame.heroStates.map(team =>
            team.map(player =>
                player.life === 0
            )
        )
    }

    /**
     * 当前选中的队伍
     * @type {-1 | 0 | 1} : -1 for none, 0 for team radiant, 1 for team dire
     */
    focusedTeam = -1
    /**
     * 当前选中的玩家
     * @type {-1 | 0 | 1 | 2 | 3 | 4} : -1 for none, 0~4 for five playerNames
     */
    focusedPlayer = -1
    /**
     * 选中一名玩家，预测他的行为
     * @param {-1 | 0 | 1} teamIndex
     * @param {-1 | 0 | 1 | 2 | 3 | 4} playerIndex
     */
    focusOnPlayer = (teamIndex, playerIndex) => {
        if (teamIndex === this.focusedTeam && playerIndex === this.focusedPlayer) {
            this.focusedTeam = -1;
            this.focusedPlayer = -1;
        } else {
            this.focusedTeam = teamIndex;
            this.focusedPlayer = playerIndex;
        }
        this.clearPredictions();
        this.clearContextLimit();
    }

    get curColor() {
        if (this.focusedTeam === -1 || this.focusedPlayer === -1) return undefined;
        return playerColors[this.focusedTeam][this.focusedPlayer];
    }

    /**
     * 当前帧
     * @type {number}
     */
    frame = 0;
    setFrame = f => {
        this.frame = f;
        this.clearPredictions();
        this.clearContextLimit();
    }

    /**
     * 从gameData中提取第frame帧的游戏中时间（单位：秒）
     * @return {number}：从-90~0为比赛正式开始前的准备时间，0~+∞是比赛正式进行的时间。
     */
    get curTime() {
        if (!this.gameData) return 0;
        const curFrame = this.gameData.gameRecords[this.frame];
        return curFrame.game_time;
    }

    /**
     * @return {import('src/model/Context.js').Context}
     */
    get curContext() {
        return genContext(this.gameData, this.frame);
    }

    contextLimit = new Set()
    hasContextLimit = (ctxGroup, ctxItem) => computed(() =>
        this.contextLimit.has(`${ctxGroup}|||${ctxItem}`)
    ).get();
    addContextLimit = (ctxGroup, ctxItem) => this.contextLimit.add(`${ctxGroup}|||${ctxItem}`);
    rmContextLimit = (ctxGroup, ctxItem) => this.contextLimit.delete(`${ctxGroup}|||${ctxItem}`);
    clearContextLimit = () => this.contextLimit.clear();

    //endregion

    get selectedPlayerTrajectory() {
        // Check if a player is selected
        if (this.focusedPlayer === -1 || !this.gameData) {
            return []
        }
        let selectedPlayerTra = []
        // for (var i=1; i <= this.gameData.gameRecords.length-1; i++) {
        for (var i = Math.max(1, this.frame - 450); i <= Math.min(this.gameData.gameRecords.length - 1, this.frame + 150); i++) {
            var pos = this.gameData.gameRecords[i].heroStates.map(team =>
                team.map(player =>
                    player.pos
                )
            );
            var pos3d = pos[this.focusedTeam][this.focusedPlayer];
            let pos2d = [pos3d[0], pos3d[1]];
            selectedPlayerTra.push(pos2d);
        }
        return selectedPlayerTra;
    }

    get allPlayerTrajectory() {
        let allPlayerTra = Array.from({length: 2}, () =>
            Array.from({length: 5}, () => [])
        );

        const startFrame = Math.max(1, this.frame - 450);
        const endFrame = Math.min(this.gameData.gameRecords.length - 1, this.frame + 150);

        for (let i = startFrame; i <= endFrame; i++) {
            const frameData = this.gameData.gameRecords[i].heroStates;
            for (let teamIdx = 0; teamIdx < 2; teamIdx++) {
                for (let playerIdx = 0; playerIdx < 5; playerIdx++) {
                    const playerPos = frameData[teamIdx][playerIdx].pos;
                    var pos = [playerPos[0], playerPos[1]]
                    allPlayerTra[teamIdx][playerIdx].push(pos);
                }
            }
        }
        console.log(allPlayerTra)
        return allPlayerTra;
    }

    //region prediction
    fakePredict = () => {
        console.warn('Failed to connect to the backend. Using fake data instead.');
        const startPos = this.playerPositions[this.focusedTeam][this.focusedPlayer];
        const strategies = genRandomStrategies(startPos, this.curContext);
        let i = 0;
        return {
            predictions: strategies.map(strat => strat.predictors).flat(),
            predGroups: strategies.map(strat => strat.predictors.map(() => i++)),
        }
    }
    predict = () => {
        if (this.devMode) {
            const {predictions, predGroups} = this.fakePredict();
            this.setPredictions(predictions);
            this.setPredGroups(predGroups);
            return;
        }

        this.setWaiting(true);
        api.predict({
            gameName: this.gameName,
            teamId: this.focusedTeam,
            playerId: this.focusedPlayer,
            frame: this.frame,
            contextLimit: this.contextLimit,
        }).catch(this.fakePredict)
            .then(res => {
                this.setPredictions(res.predictions);
                this.setPredGroups(res.predGroups);
            }).finally(() => this.setWaiting(false));
    }

    /**
     * Predictions
     * @type {import('src/model/Strategy.d.ts').Prediction[]}
     */
    predictions = []
    setPredictions = pred => this.predictions = pred;
    viewedPrediction = -1;
    viewPrediction = p => this.viewedPrediction = (p === this.viewedPrediction ? -1 : p);
    /**
     * prediction groups
     * @type {number[][]}
     */
    predictionGroups = []
    setPredGroups = predG => this.predictionGroups = predG;
    /**
     * @type {number[]}
     */
    selectedPredictors = [];
    selectPredictors = ps => this.selectedPredictors = ps;

    /**
     * @return {import('src/model/Strategy.d.ts').Strategy | null}
     */
    get selectedPredictorsAsAStrategy() {
        const selectedPredictors = this.selectedPredictors.map(i => this.predictions[i]);
        if (selectedPredictors.length === 0) return null;
        return {
            predictors: selectedPredictors,
            attention: contextFactory(this.curContext, (g, i) => getStratAttention(selectedPredictors, g, i))
        };
    }

    clearPredictions = () => {
        this.setPredictions([]);
        this.viewPrediction(-1);
        this.setPredGroups([]);
        this.selectPredictors([]);
    }
    //endregion
}

export default Store;
