export const teamNames = ['Radiant', 'Dire']
export const teamShapes = ['rect', 'circle']
export const playerColors = [
    ['#3476FF', '#67FFC0', '#C000C0', '#F3F00C', '#FF6C00'],
    ['#FE87C3', '#A2B548', '#66D9F7', '#008422', '#A56A00'],
]
export const MIN_X = 8240, MAX_X = 24510;
export const MIN_Y = 8220, MAX_Y = 24450;
const x = v => (v - MIN_X) / (MAX_X - MIN_X);
const y = v => (MAX_Y - v) / (MAX_Y - MIN_Y);
const rx = v => v * (MAX_X - MIN_X) + MIN_X;
const ry = v => MAX_Y - v * (MAX_Y - MIN_Y);

export const lanePositions = [
    [[9794, 12625], [9794, 22144], [20280, 22144]],
    [[11518, 12008], [20903, 20387]],
    [[12104, 10277], [22712, 10277], [22712, 19768]],
];
export const laneLength = [
    [20005, 9519, 10486],
    [12581, 12581],
    [20099, 10608, 9491]
];

export function getWorldPosByLanePos(laneId, lanePos) {
    const anchors = lanePositions[laneId], lengths = laneLength[laneId];
    if (lanePos === 0) return anchors[0];
    if (lanePos === 1) return anchors[anchors.length - 1];

    let worldLanePos = lanePos * lengths[0];
    for (let i = 1; i < anchors.length; i++)
        if (worldLanePos > lengths[i]) worldLanePos -= lengths[i];
        else {
            let vx = anchors[i][0] - anchors[i - 1][0], vy = anchors[i][1] - anchors[i - 1][1];
            const scale = worldLanePos / lengths[i];
            vx *= scale;
            vy *= scale;
            return [vx + anchors[i - 1][0], vy + anchors[i - 1][1]];
        }
    return [-1, -1];
}

export function formatTime(t) {
    const sign = t < 0 ? '-' : '';
    t = Math.abs(t);
    const h = Math.floor(t / 3600)
    t -= h * 3600;
    const m = Math.floor(t / 60)
    t -= m * 60;
    const s = Math.floor(t);

    const str = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    if (h === 0) return `${sign}${str}`;
    else return `${sign}${h}:${str}`;
}

/**
 * Project the positions in data onto the map
 * @param {[number, number]} posInData
 * @param {number} mapSize
 * @param {boolean=False} reverse : project the position on the map to that in data
 */
export const mapProject = (posInData, mapSize, reverse = false) => {
    if (reverse)
        return [
            rx(posInData[0] / mapSize),
            ry(posInData[1] / mapSize),
        ]
    else
        return [
            x(posInData[0]) * mapSize,
            y(posInData[1]) * mapSize,
        ]
}

/**
 * Convert compressed game data into released form
 * @param {import('src/model/D2Data.d.ts').D2Data} compressedGameData
 * @return {import('src/model/D2Data.d.ts').D2Data}
 */
export const updateGameData = (compressedGameData) => {
    const preRecord = {
        tick: 0,
        game_time: 0,
        roshan_hp: 0,
        is_night: false,
        events: [],
        heroStates: [[], []],
        teamStates: [],
    };
    const updateGR = (gr) => {
        preRecord.tick = gr.tick;
        preRecord.game_time = gr.game_time;
        if (gr.hasOwnProperty('is_night')) preRecord.is_night = gr.is_night;
        if (gr.hasOwnProperty('roshan_hp')) preRecord.roshan_hp = gr.roshan_hp;
        preRecord.events = gr.events;
        for (let i = 0; i < 2; i++)
            for (let j = 0; j < 5; j++)
                preRecord.heroStates[i][j] = Object.assign({}, preRecord.heroStates[i][j], gr.heroStates[i][j]);
        for (let i = 0; i < 2; i++)
            preRecord.teamStates[i] = Object.assign({}, preRecord.teamStates[i], gr.teamStates[i]);
    }
    return {
        gameInfo: compressedGameData.gameInfo,
        gameRecords: compressedGameData.gameRecords.map(gr => {
            updateGR(gr);
            return JSON.parse(JSON.stringify(preRecord));
        })
    };
}

export function mapDis(pos1, pos2) {
    return Math.sqrt((pos1[0] - pos2[0]) * (pos1[0] - pos2[0]) + (pos1[1] - pos2[1]) * (pos1[1] - pos2[1]))
}

export function roshanMaxHP(gameTime) {
    if (gameTime < 0 || !gameTime) return 0;
    return Math.floor(gameTime / 60) * 130 + 6000;
}

/**
 * @param {import('src/model/D2Data.js').D2Data | null} gameData
 * @param {number} frame
 * @return {import('src/model/Context.js').Context}
 */
export function genContext(gameData, frame) {
    const gameRecord = gameData ? gameData.gameRecords[frame] : null;
    const ctx = {};
    [0, 1].forEach(tId => [0, 1, 2, 3, 4].forEach(pId => {
        const playerRec = gameRecord ? gameRecord.heroStates[tId][pId] : {pos: []};
        const playerCtx = ctx[`p${tId}${pId}`] = {};
        playerCtx.health = [playerRec.hp, playerRec.mhp];
        playerCtx.mana = [playerRec.mp, playerRec.mmp];
        playerCtx.position = playerRec.pos.slice(0, 2);
        playerCtx.level = playerRec.lvl;
        playerCtx.isAlive = playerRec.life === 0;
        playerCtx.gold = playerRec.gold;
    }));
    [0, 1].forEach(tId => {
        const teamRec = gameRecord ? gameRecord.teamStates[tId] : {towers: [], creeps: []};
        const teamCtx = ctx[`t${tId}`] = {};
        teamCtx.towerTop1 = teamRec.towers[0];
        teamCtx.towerTop2 = teamRec.towers[1];
        teamCtx.towerTop3 = teamRec.towers[2];
        teamCtx.towerMid1 = teamRec.towers[3];
        teamCtx.towerMid2 = teamRec.towers[4];
        teamCtx.towerMid3 = teamRec.towers[5];
        teamCtx.towerBot1 = teamRec.towers[6];
        teamCtx.towerBot2 = teamRec.towers[7];
        teamCtx.towerBot3 = teamRec.towers[8];
        teamCtx.towerBase1 = teamRec.towers[10];
        teamCtx.towerBase2 = teamRec.towers[11];
        teamCtx.creepTop = teamRec.creeps[0];
        teamCtx.creepMid = teamRec.creeps[1];
        teamCtx.creepBot = teamRec.creeps[2];
    })
    ctx.g = {
        gameTime: gameRecord?.game_time,
        isNight: gameRecord?.is_night,
        roshanHP: [gameRecord?.roshan_hp, roshanMaxHP(gameRecord?.game_time)],
    }
    return ctx;
}
