import {useMemo} from "react";

/**
 * @return {import('src/model/Strategy.js').PredictorsStoryline}
 */
export default function useStorylineData() {
    return useMemo(() => ({
        stages: [
            {
                groups: [
                    [0, 1, 4, 5, 9],
                    [10, 11, 14, 12],
                    [2, 3, 6, 7],
                    [8, 13, 16, 17, 19],
                    [15, 18]
                ],
                instances: 300,
            },
            {
                groups: [
                    [0, 1, 4, 5, 9, 10],
                    [11, 14, 2, 3, 6],
                    [12, 7, 8, 13],
                    [16, 17],
                    [19],
                    [15, 18],
                ],
                instances: 200,
            }
        ],
        numPredictors: 20,
        totalInstances: 500
    }), []);
}