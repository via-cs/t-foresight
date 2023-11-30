import {makeAutoObservable, observable} from "mobx";
import {playerColors, updateGameData} from "../utils/game.js";
import {genRandomStrategies, genRandomStrategy} from "../utils/fakeData.js";

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

        this.setStrategies(genRandomStrategies());
    }

    /**
     * 系统状态，在执行一些费时的操作时，如果不希望用户在此期间和系统交互，可以设置waiting为true
     * @type {boolean}
     */
    waiting = false
    setWaiting = state => this.waiting = state;

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
     * @param {0 | 1} teamIndex
     * @param {0 | 1 | 2 | 3 | 4} playerIndex
     */
    focusOnPlayer = (teamIndex, playerIndex) => {
        if (teamIndex === this.focusedTeam && playerIndex === this.focusedPlayer) {
            this.focusedTeam = -1;
            this.focusedPlayer = -1;
        } else {
            this.focusedTeam = teamIndex;
            this.focusedPlayer = playerIndex;
        }
    }

    /**
     * Game gameData instance
     * @type {import('src/model/D2Data.d.ts').D2Data | null}
     */
    gameData = null;
    /**
     * Import gameData
     * @param {import('src/model/D2Data.d.ts').D2Data} gameData
     */
    setData = gameData => {
        this.gameData = updateGameData(gameData);
    }

    /**
     * 当前帧
     * @type {number}
     */
    frame = 0;
    setFrame = f => this.frame = f;

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
     * 从gameData中提取第frame帧的游戏中时间（单位：秒）
     * @return {number}：从-90~0为比赛正式开始前的准备时间，0~+∞是比赛正式进行的时间。
     */
    get curTime() {
        if (!this.gameData) return 0;
        const curFrame = this.gameData.gameRecords[this.frame];
        return curFrame.game_time;
    }

    get curFrame() {
        return this.frame;
    }

    get curColor() {
        return playerColors[this.focusedTeam][this.focusedPlayer];
    }

    get selectedPlayerTrajectory() {
        // Check if a player is selected
        if (this.focusedPlayer === -1 || !this.gameData) {
            return []
        }
        let selectedPlayerTra = []
        // for (var i=1; i <= this.gameData.gameRecords.length-1; i++) {
        for (var i= Math.max(1, this.frame-450); i <= Math.min(this.gameData.gameRecords.length-1, this.frame+150); i++) {
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

    get allPlayerTrajectory () {
        let allPlayerTra = Array.from({ length: 2 }, () => 
            Array.from({ length: 5 }, () => [])
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

    /**
     * Strategies
     * @type {import('src/model/Strategy.d.ts').StrategyList}
     */
    strategies = []
    setStrategies = s => this.strategies = s;
    expandedStrategy = -1
    expandStrategy = sId => this.expandedStrategy = (this.expandedStrategy === sId) ? -1 : sId;
    viewedStrategy = -1
    viewStrategy = sId => {
        if (this.viewedPrediction === -1) {
            const targetSId = (this.viewedStrategy === sId) ? -1 : sId;
            this.viewedStrategy = targetSId;
            this.expandedStrategy = targetSId;
        } else {
            this.viewedStrategy = sId;
            this.expandedStrategy = sId;
            this.viewedPrediction = -1;
        }
    }
    viewedPrediction = -1
    viewPrediction = (sId, pId) => {
        if (this.viewedStrategy === sId && this.viewedPrediction === pId) {
            this.expandedStrategy = -1;
            this.viewedStrategy = -1;
            this.viewedPrediction = -1;
        } else {
            this.expandedStrategy = sId;
            this.viewedStrategy = sId;
            this.viewedPrediction = pId;
        }
    }
}

export default Store;
