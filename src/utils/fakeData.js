import {MAX_X, MAX_Y, MIN_X, MIN_Y} from "./game.js";

const DIS = 175;

export function getStratAttention(predictors, groupName, itemName) {
    const values = predictors.map(p => p.attention[groupName][itemName]);
    return {
        avg: values.reduce((p, c) => p + c, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
    }
}

export function contextFactory(factory) {
    return Object.fromEntries(['p00', 'p01', 'p02', 'p03', 'p04', 'p10', 'p11', 'p12', 'p13', 'p14', 'g'].map(g => [
        g,
        {
            [g + 'a']: factory(g, g+'a'),
            [g + 'b']: factory(g, g+'b'),
            [g + 'c']: factory(g, g+'c'),
            [g + 'd']: factory(g, g+'d'),
            [g + 'e']: factory(g, g+'e'),
            [g + 'f']: factory(g, g+'f'),
        }
    ]))
}

/**
 * @return {import('src/model/Strategy.d.ts').Prediction}
 */
function genRandomPrediction(startPos, startDir) {
    const trajectory = [startPos];
    let lastPos = startPos, lastDir = startDir;
    for (let i = 0; i < 10; i++) {
        lastDir += Math.random() * Math.PI / 4 - Math.PI / 8;
        const dis = DIS * (Math.random() * 0.2 + 0.9);
        const newPos = [lastPos[0] + dis * Math.cos(lastDir), lastPos[1] + dis * Math.sin(lastDir)];
        trajectory.push(newPos)
        lastPos = newPos;
    }
    return {
        trajectory,
        probability: Math.random(),
        attention: contextFactory(() => Math.random())
    }
}

/**
 * @return {import('src/model/Strategy.d.ts').Strategy}
 */
export function genRandomStrategy(startPos) {
    const randomDir = Math.random() * 2 * Math.PI;
    const predictors = new Array(Math.floor(Math.random() * 4 + 2)).fill(0)
        .map(() => genRandomPrediction(startPos, randomDir))
        .sort((a, b) => b.probability - a.probability);
    return {
        predictors,
        attention: contextFactory((g, i) => getStratAttention(predictors, g, i)),
    }
}

export function genContext(frame) {
    return contextFactory((g, i) => {
        if (i.endsWith('a') || i.endsWith('b')) return Math.random() * 100
        if (i.endsWith('c') || i.endsWith('d')) return Math.random() > 0.5
        return String.fromCharCode(...new Array(7)
            .fill(0)
            .map(() => Math.floor(Math.random() * 26) + 97)
        );
    })
}

function stratProb(strat) {
    return strat.predictors.reduce((p, c) => p + c.probability, 0);
}

export function genRandomStrategies() {
    const startPos = [
        (Math.random() + 0.5) * (MAX_X - MIN_X) / 2 + MIN_X,
        (Math.random() + 0.5) * (MAX_Y - MIN_Y) / 2 + MIN_Y
    ];
    const res = new Array(Math.floor(Math.random() * 3 + 4)).fill(0)
        .map(() => genRandomStrategy(startPos))
    const sumProb = res.reduce((p, c) => p + stratProb(c), 0);
    res.forEach(s => s.predictors.forEach(p => p.probability /= sumProb));
    res.sort((a, b) => stratProb(b) - stratProb(a));
    return res;
}