import {useMemo} from "react";

/**
 * @param {import('src/model/Strategy.js').StorylinesStage} stage
 */
function getItemPos(stage) {
    const res = [];
    let pos = 0;
    stage.groups.forEach(group => group.forEach(item => res[item] = pos++));
    return res;
}

/**
 * @param {import('src/model/Strategy.js').StorylineGroup} ga
 * @param {import('src/model/Strategy.js').StorylineGroup} gb
 * @param {number[]} lastPos
 * @return {-1, 0, 1}
 */
function getCrossings(ga, gb, lastPos) {
    let res = 0;
    for (const i of ga)
        for (const j of gb)
            if (lastPos[i] < lastPos[j]) res--;
            else res++;
    return res;
}

/**
 * @param {import('src/model/Strategy.js').PredictorsStoryline} data
 */
function sortGroups(data) {
    for (let i = 1; i < data.stages.length; i++) {
        const lastPos = getItemPos(data.stages[i - 1]);
        const stage = data.stages[i];
        stage.groups.sort((ga, gb) =>
            getCrossings(ga, gb, lastPos)
        )
    }
}

/**
 * @param {import('src/model/Strategy.js').PredictorsStoryline} data
 */
function sortItems(data) {
    let lastPos = getItemPos(data.stages[0]);
    for (let i = 1; i < data.stages.length; i++) {
        const stage = data.stages[i];
        for (const group of stage.groups)
            group.sort((a, b) => lastPos[a] - lastPos[b]);
        lastPos = getItemPos(stage);
    }
}

/**
 *
 * @param {import('src/model/Strategy.js').PredictorsStoryline} data
 * @return {import('src/model/Strategy.js').PredictorsStoryline}
 */
export default function useStorylineLayout(data) {
    return useMemo(() => {
        data.stages.reverse();
        sortGroups(data);
        sortItems(data);
        data.stages.reverse();
        sortGroups(data);
        sortItems(data);
        return data;
    }, [data]);
}