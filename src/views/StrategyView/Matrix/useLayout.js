export default function useMatrixLayout({
                                            predictors,
                                            predictorGroups,
                                            selectedPredictors,
                                            width,
                                            height,
                                            gridGapRatio = 0.1,
                                            groupGapRatio = 1,
                                        }) {
    // W = selectedPredictors * (gridSize + gridGap) - gridGap
    //   = (selectedPredictors + selectedPredictors * gridGapRatio - gridGapRatio) * gridSize
    const xGridSize = width / (selectedPredictors + selectedPredictors * gridGapRatio - gridGapRatio);

    // H = (predictorGroups - 1) * groupGap + (predictors - predictorGroups) * gridGap + predictors * gridSize
    //   = ((predictorGroups - 1) * groupGapRatio + (predictors - predictorGroups) * gridGapRatio + predictors) * gridSize
    const yGridSize = height / ((predictorGroups - 1) * groupGapRatio + (predictors - predictorGroups) * gridGapRatio + predictors);

    const gridSize = Math.min(xGridSize, yGridSize);
    const gridGap = gridSize * gridGapRatio;

    return {
        gridSize, gridGap, groupGap: gridSize * groupGapRatio,
        matrixWidth: (selectedPredictors * (gridSize + gridGap) - gridGap)
    };
}