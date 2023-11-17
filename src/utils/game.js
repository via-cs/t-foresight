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
