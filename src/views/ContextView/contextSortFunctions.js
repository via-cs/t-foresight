const defaultRank = ['t0', 'p00', 'p01', 'p02', 'p03', 'p04', 't1', 'p10', 'p11', 'p12', 'p13', 'p14', 'g']

function getHighestAttKeys(cg) {
    const att = [[0, ''], [0, ''], [0, '']];
    Object.keys(cg.attention).forEach(key => {
        const val = cg.attention[key].avg;
        if (val > att[0][0]) {
            att.unshift([val, key])
            att.pop();
        } else if (val > att[1][0]) {
            att.splice(1, 0, [val, key]);
            att.pop();
        } else if (val > att[2][0]) {
            att.splice(2, 1, [val, key]);
        }
    })
    return att.map(i => i[1]);
}

export function getHighestAtt(cg) {
    let att = [];
    Object.keys(cg.attention).forEach(key => {
        const vals = Object.values(cg.attention[key]);
        const avgs = []
        Object.keys(vals).forEach(feature => {
            avgs.push(vals[feature].avg);
        });
        avgs.sort((a, b) => b - a);
        att[key] = avgs.slice(0, 3);
    })
    return att;
}

function getAttVal(cg, keys) {
    console.log(cg.attention);
    if (!cg || !cg.attention) {
        console.error('cg.attention is undefined', cg.attention);
        return 0; // or handle the error appropriately
    }
    return keys.reduce((p, key) => p + cg.attention[key].avg , 0);
}

function getCompAttVal(cg, keys) {
    return keys.reduce((p, key) => p + Math.abs(cg.compAtt[key].avg - cg.attention[key].avg), 0)
}

const defaultComparator = (cga, cgb) => defaultRank.indexOf(cga.key) - defaultRank.indexOf(cgb.key)

export const contextSortFunctions = {
    default: {
        disabled: () => false,
        comparator: defaultComparator
    },
    highAttFirst: {
        disabled: store => store.selectedPredictors.length === 0 && store.comparedPredictors.length === 0,
        comparator: (cga, cgb) => {
            const aKeys = getHighestAttKeys(cga), bKeys = getHighestAttKeys(cgb);
            const aVal = getAttVal(cga, aKeys), bVal = getAttVal(cgb, bKeys);
            return (bVal - aVal) || defaultComparator(cga, cgb);
        }
    },
    lowAttFirst: {
        disabled: store => store.selectedPredictors.length === 0 && store.comparedPredictors.length === 0,
        comparator: (cga, cgb) => {
            const aKeys = getHighestAttKeys(cga), bKeys = getHighestAttKeys(cgb);
            const aVal = getAttVal(cga, aKeys), bVal = getAttVal(cgb, bKeys);
            return (aVal - bVal) || defaultComparator(cga, cgb);
        }
    },
    highDiffFirst: {
        disabled: store => store.selectedPredictors.length === 0 || store.comparedPredictors.length === 0,
        comparator: (cga, cgb) => {
            const aKeys = getHighestAttKeys(cga), bKeys = getHighestAttKeys(cgb);
            return (getCompAttVal(cgb, bKeys) - getCompAttVal(cga, aKeys)) || defaultComparator(cga, cgb);
        }
    },
    lowDiffFirst: {
        disabled: store => store.selectedPredictors.length === 0 || store.comparedPredictors.length === 0,
        comparator: (cga, cgb) => {
            const aKeys = getHighestAttKeys(cga), bKeys = getHighestAttKeys(cgb);
            return (getCompAttVal(cga, aKeys) - getCompAttVal(cgb, bKeys)) || defaultComparator(cga, cgb);
        }
    },
}