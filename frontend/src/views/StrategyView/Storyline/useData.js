import {randint, shuffle} from "../../../utils/fakeData.js";
import newArr from "../../../utils/newArr.js";

function mergeGroup(groups) {
    let i = randint(0, groups.length - 1), j = randint(0, groups.length - 1);
    if (i === j) j = (j + 1) % groups.length;
    if (i > j) [i, j] = [j, i];
    const groupJ = groups.splice(j, 1)[0], groupI = groups.splice(i, 1)[0];
    groups.push([...groupI, ...groupJ]);
}

function splitGroup(groups) {
    const largeGroups = groups.map((_, i) => i).filter(i => groups[i].length > 1);
    const gIdToSplit = largeGroups[randint(0, largeGroups.length - 1)];
    const group = groups.splice(gIdToSplit, 1)[0];
    shuffle(group);
    const splitIdx = randint(1, group.length - 1);
    groups.push(group.slice(0, splitIdx), group.slice(splitIdx));
}

function moveItem(groups) {
    const sourceGroupIdx = randint(0, groups.length - 1);
    const targetGroupIdx = randint(0, groups.length - 1);
    const sourceGroup = groups[sourceGroupIdx];
    const targetGroup = groups[targetGroupIdx];
    const sourceItemIdx = randint(0, sourceGroup.length - 1);
    const itemToMove = sourceGroup.splice(sourceItemIdx, 1)[0];
    targetGroup.push(itemToMove);

    if (sourceGroup.length === 0)
        groups.splice(sourceGroupIdx, 1);
}

function changeGroup(groups) {
    groups = JSON.parse(JSON.stringify(groups));
    for (let i = randint(4, 6); i--;) {
        const op = Math.random();
        if (op < 0.2) mergeGroup(groups)
        else if (op < 0.5) splitGroup(groups)
        else moveItem(groups)
    }
    return groups;
}

/**
 * @return {import('src/model/Strategy.js').PredictorsStoryline}
 */
export default function genStorylineData(initGroups) {
    const totalInstances = randint(300, 700);
    const numPredictors = initGroups.reduce((p, c) => p + c.length, 0);

    const instances = newArr(randint(5, 7), () => randint(0, totalInstances));
    instances.sort((a, b) => a - b);
    instances.push(totalInstances);
    for (let i = instances.length - 1; i > 0; i--)
        instances[i] -= instances[i - 1];
    instances.sort((a, b) => b - a);
    while (instances[instances.length - 1] === 0) instances.pop();

    let curGroups = JSON.parse(JSON.stringify(initGroups));
    /**
     * @type {import('src/model/Strategy.js').StorylineStage[]}
     */
    const stages = [];
    instances.forEach(instances => {
        stages.push({
            groups: curGroups,
            instances
        })
        curGroups = changeGroup(curGroups);
    })

    return {
        stages,
        numPredictors,
        totalInstances,
    }
}

export function initStorylineData() {
    return {
        stages: [{
            groups: newArr(20, i => [i]),
            instances: 0,
        }], numPredictors: 20, totalInstances: 1
    }
}