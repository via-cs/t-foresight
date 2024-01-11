import {useMemo} from "react";
import newArr from "../../../utils/newArr.js";

/**
 *
 * @param {import('src/model/Strategy.js').PredictorsStoryline} data
 * @param {number} width
 * @param {number} height
 * @return {[number, number][][]}
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

        return lines;
    }, [data, width, height])
}