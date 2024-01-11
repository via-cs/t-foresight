import newArr from "./newArr.js";

const DIS = 175;

export function randint(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}

export function rand(min, max) {
    return Math.random() * (max - min) + min;
}

export function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = randint(0, i);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

export function getStratAttention(predictors, groupName, itemName) {
    const values = predictors.map(p => p.attention[groupName][itemName]);
    return {
        avg: values.reduce((p, c) => p + c, 0) / values.length, min: Math.min(...values), max: Math.max(...values),
    }
}

export function contextFactory(context, factory) {
    return Object.fromEntries(Object.keys(context).map(g => [g, Object.fromEntries(Object.keys(context[g]).map(i => [i, factory(g, i)]))]))
}

/**
 * @return {import('src/model/Strategy.d.ts').Prediction}
 */
function genRandomPrediction(startPos, context, startDir) {
    const trajectory = [startPos];
    let lastPos = startPos, lastDir = startDir;
    for (let i = 0; i < 10; i++) {
        lastDir += rand(-Math.PI / 8, Math.PI / 8);
        const dis = DIS * rand(0.9, 1.1);
        const newPos = [lastPos[0] + dis * Math.cos(lastDir), lastPos[1] + dis * Math.sin(lastDir)];
        trajectory.push(newPos)
        lastPos = newPos;
    }
    return {
        trajectory, probability: rand(0, 1), attention: contextFactory(context, () => rand(0, 1))
    }
}

/**
 * @return {import('src/model/Strategy.d.ts').Strategy}
 */
export function genRandomStrategy(startPos, context, predNum) {
    const randomDir = rand(0, 2 * Math.PI);
    const predictors = newArr(predNum, 0)
        .map(() => genRandomPrediction(startPos, context, randomDir))
        .sort((a, b) => b.probability - a.probability);
    return {
        predictors, attention: contextFactory(context, (g, i) => getStratAttention(predictors, g, i)),
    }
}

function stratProb(strat) {
    return strat.predictors.reduce((p, c) => p + c.probability, 0);
}

function randomSplit(sum, n) {
    sum -= n;
    const splits = newArr(n - 1, () => randint(0, sum))
    splits.push(0, sum)
    splits.sort((a, b) => a - b);
    const res = [];
    for (let i = 1; i < splits.length; i++) res.push(splits[i] - splits[i - 1] + 1);
    return res;
}

export function genRandomStrategies(startPos, context, predCnt = 20) {
    const stratCnt = randint(4, 6);
    const predNums = randomSplit(predCnt, stratCnt);
    const res = predNums.map(cnt => genRandomStrategy(startPos, context, cnt))
    const sumProb = res.reduce((p, c) => p + stratProb(c), 0);
    res.forEach(s => s.predictors.forEach(p => p.probability /= sumProb));
    res.sort((a, b) => stratProb(b) - stratProb(a));
    return res;
}

export function genProjection(predictions, groups) {
    const pos = [];
    const sectionRad = Math.PI * 2 / groups.length;
    groups.forEach((g, i) => {
        const rad = (i + rand(0.25, 0.75)) * sectionRad,
            r = rand(0.25, 0.4);
        const cx = 0.5 + Math.cos(rad) * r, cy = 0.5 + Math.sin(rad) * r;
        g.forEach(i => pos[i] = [
            (Math.random() * 2 - 1) * 0.15 + cx,
            (Math.random() * 2 - 1) * 0.15 + cy,
            1,
        ])
    })
    return pos;
}