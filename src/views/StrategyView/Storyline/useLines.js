import {useMemo} from "react";
import newArr from "../../../utils/newArr.js";

/**
 *
 * @param {number[]} nG
 * @param {number[]} cG
 * @return boolean
 */
function isSubGroup(nG, cG) {
    if (nG.length > cG.length) return false;
    if (nG.some(lId => !cG.includes(lId))) return false;
    return cG.indexOf(nG[nG.length - 1]) - cG.indexOf(nG[0]) === nG.length - 1;

}

/**
 *
 * @param {import('src/model/Strategy.js').PredictorsStoryline} data
 * @param {number} width
 * @param {number} height
 * @return {{lines: [number, number][][], groups: {x: number, y: number, width: number, height: number}[], lineGap: number}}
 */
export default function useStorylineLines(data, width, height, config) {
    return useMemo(() => {
        //region key parameters
        const {pt, pb, pl, pr, stageMaxGap, stageGapMaxRatio, lineMaxGap, lineGapMaxRatio} = config;
        const stageGap = Math.min(
            stageMaxGap,
            (height - pt - pb) * stageGapMaxRatio / (data.stages.length - 1)
        );
        const instUnit = (height - pt - pb - (data.stages.length - 1) * stageGap) / data.totalInstances;
        const maxGroups = data.stages.reduce((p, c) => Math.max(p, c.groups.length), 0);
        const lineGap = Math.min(
            lineMaxGap,
            (width - pl - pr) / (data.numPredictors + (maxGroups - 1) / lineGapMaxRatio - maxGroups)
        );
        const groupGap = (width - pl - pr - (data.numPredictors - 1) * lineGap) / (maxGroups - 1) + lineGap;
        //endregion

        //region points
        const lines = newArr(data.numPredictors, () => newArr(data.stages.length * 2, () => [0, 0]));
        let y = pt;
        for (const [i, stage] of data.stages.entries()) {
            const yt = y, yb = y + stage.instances * instUnit;
            y = yb + stageGap;

            const stageWidth = (stage.groups.length - 1) * groupGap + (data.numPredictors - stage.groups.length) * lineGap;
            let x = width / 2 - stageWidth / 2;
            for (const group of stage.groups) {
                for (const lId of group) {
                    lines[lId][i * 2] = [x, yt];
                    lines[lId][i * 2 + 1] = [x, yb];
                    x += lineGap;
                }
                x += groupGap - lineGap;
            }
        }
        //endregion

        //region layout refinement based on group
        const sortSIds = newArr(data.stages.length, i => i);
        sortSIds.sort((a, b) => data.stages[b].groups.length - data.stages[a].groups.length);

        function refine(sId, step) {
            const nsId = sId + step;
            if (nsId < 0 || nsId >= data.stages.length) return;
            let modFlag = false;
            const curGroups = data.stages[sId].groups, nxtGroups = data.stages[nsId].groups;
            if (curGroups.length > nxtGroups.length)
                for (const [initNGId, initGId, dir] of [[0, 0, 1], [nxtGroups.length - 1, curGroups.length - 1, -1]])
                    for (let gId = initGId, ngId = initNGId; ngId >= 0 && ngId < nxtGroups.length; gId += dir, ngId += dir) {
                        if (!isSubGroup(nxtGroups[ngId], curGroups[gId])) break;

                        for (const lId of nxtGroups[ngId]) {
                            const nx = lines[lId][sId * 2][0];
                            lines[lId][nsId * 2][0] = nx;
                            lines[lId][nsId * 2 + 1][0] = nx;
                        }
                        modFlag = true;
                    }
            if (modFlag) refine(nsId, step);
        }

        for (const sId of sortSIds) {
            refine(sId, -1);
            refine(sId, 1);
        }
        //endregion

        //region groups
        const uniqueGroups = {};
        for (const [i, stage] of data.stages.entries())
            for (const group of stage.groups) {
                const groupId = group.join('|');
                if (!uniqueGroups[groupId]) uniqueGroups[groupId] = [];
                uniqueGroups[groupId].push(i);
            }

        const groups = [];
        for (const groupId of Object.keys(uniqueGroups)) {
            const lineIds = groupId.split('|');
            const l1 = parseInt(lineIds[0]), l2 = parseInt(lineIds[lineIds.length - 1]);
            const spannedStages = uniqueGroups[groupId];
            let start = 0, end = 0;
            while (end < spannedStages.length) {
                while (end + 1 < spannedStages.length && spannedStages[end + 1] - spannedStages[start] === end + 1 - start) end++;
                const [x, y] = lines[l1][spannedStages[start] * 2];
                const [x1, y1] = lines[l2][spannedStages[end] * 2 + 1];
                groups.push({x, y, width: x1 - x, height: y1 - y});
                start = end = end + 1;
            }
        }
        //endregion

        return {lines, groups, lineGap};
    }, [data, width, height])
}