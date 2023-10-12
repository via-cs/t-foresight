import {makeAutoObservable, observable} from "mobx";
import {updateGameData} from "../utils/game.js";

class Store {
    constructor() {
        makeAutoObservable(this, {gameData: observable.shallow});
    }

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
        console.log(this.gameData);
    }

    frame = 0;
    setFrame = f => this.frame = f;

    /**
     * Get player names
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
     * Get the number of frames
     * @returns {number}
     */
    get numFrames() {
        if (this.gameData === null) return 0;
        return this.gameData.gameRecords.length;
    }

    /**
     * Get the player positions at current frame
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
     * Get whether each player is alive
     * @return {boolean[][]}
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

    get curTime() {
        if (!this.gameData) return 0;
        const curFrame = this.gameData.gameRecords[this.frame];
        return curFrame.game_time;
    }
}

export default Store;
