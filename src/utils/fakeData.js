const DIS = 175;

function randint(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

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
            [g + 'a']: factory(g, g + 'a'),
            [g + 'b']: factory(g, g + 'b'),
            [g + 'c']: factory(g, g + 'c'),
            [g + 'd']: factory(g, g + 'd'),
            [g + 'e']: factory(g, g + 'e'),
            [g + 'f']: factory(g, g + 'f'),
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
        lastDir += rand(-Math.PI / 8, Math.PI / 8);
        const dis = DIS * rand(0.9, 1.1);
        const newPos = [lastPos[0] + dis * Math.cos(lastDir), lastPos[1] + dis * Math.sin(lastDir)];
        trajectory.push(newPos)
        lastPos = newPos;
    }
    return {
        trajectory,
        probability: rand(0, 1),
        attention: contextFactory(() => rand(0, 1))
    }
}

/**
 * @return {import('src/model/Strategy.d.ts').Strategy}
 */
export function genRandomStrategy(startPos, predNum) {
    const randomDir = rand(0, 2 * Math.PI);
    const predictors = new Array(predNum).fill(0)
        .map(() => genRandomPrediction(startPos, randomDir))
        .sort((a, b) => b.probability - a.probability);
    return {
        predictors,
        attention: contextFactory((g, i) => getStratAttention(predictors, g, i)),
    }
}

export function genContext(frame) {
    return contextFactory((g, i) => {
        if (i.endsWith('a') || i.endsWith('b')) return rand(0, 100)
        if (i.endsWith('c') || i.endsWith('d')) return rand(0, 1) > 0.5
        return String.fromCharCode(...new Array(7)
            .fill(0)
            .map(() => randint(97, 122))
        );
    })
}

function stratProb(strat) {
    return strat.predictors.reduce((p, c) => p + c.probability, 0);
}

function randomSplit(sum, n) {
    sum -= n;
    const splits = new Array(n - 1).fill(0).map(() => randint(0, sum))
    splits.push(0, sum)
    splits.sort((a, b) => a - b);
    const res = [];
    for (let i = 1; i < splits.length; i++) res.push(splits[i] - splits[i - 1] + 1);
    return res;
}

export function genRandomStrategies(startPos, predCnt = 20) {
    const stratCnt = randint(4, 6);
    const predNums = randomSplit(predCnt, stratCnt);
    const res = predNums.map(cnt => genRandomStrategy(startPos, cnt))
    const sumProb = res.reduce((p, c) => p + stratProb(c), 0);
    res.forEach(s => s.predictors.forEach(p => p.probability /= sumProb));
    res.sort((a, b) => stratProb(b) - stratProb(a));
    return res;
}