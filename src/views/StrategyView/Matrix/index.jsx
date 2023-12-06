import {inject, observer} from "mobx-react";
import {Group, Layer, Stage, Text} from "react-konva";
import {useRef} from "react";
import useSize from "../../../utils/useSize.js";
import {styled, useTheme} from "@mui/material/styles";
import useMatrixData from "./useData.js";
import useMatrixLayout from "./useLayout.js";
import Cell from "./Cell.jsx";

const config = {
    pl: 40, pt: 30, pb: 10, pr: 10,
}

/**
 *
 * @param {import('src/store/store.js').Store} store
 * @return {JSX.Element}
 * @constructor
 */
function PredictorsMatrix({store}) {
    const containerRef = useRef(null);
    const {width, height} = useSize(containerRef);
    const {pl, pt, pr, pb} = config;

    const data = useMatrixData(store.predictions, store.predictionGroups);
    const {gridSize, gridGap, groupGap, matrixWidth} = useMatrixLayout({
        predictors: store.predictions.length,
        predictorGroups: store.predictionGroups.length,
        selectedPredictors: store.selectedPredictors.length + 1,
        width: width - pl - pr,
        height: height - pt - pb,
    });

    const groupY = store.predictionGroups.reduce((p, c) => {
        const curPos = p[p.length - 1];
        const nextPos = curPos + c.length * gridSize + (c.length - 1) * gridGap + groupGap;
        p.push(nextPos);
        return p;
    }, [pt]);
    const theme = useTheme();

    return <Container ref={containerRef}>
        <Stage width={width} height={height}>
            <Layer>
                <Group x={pl + (width - pl - pr) / 2 - matrixWidth / 2}>
                    {store.predictionGroups.map((group, gId) => <Group key={gId} y={groupY[gId]}>
                        {group.map((p1, p1Id) => <Group key={p1Id} y={p1Id * (gridSize + gridGap)}
                                                        onMouseEnter={() => store.viewPrediction(p1)}
                                                        onMouseLeave={() => store.viewPrediction(-1)}>
                            {store.selectedPredictors.map((p2, p2Id) => <Group key={p2Id}
                                                                               x={p2Id * (gridSize + gridGap)}>
                                <Cell gridSize={gridSize}
                                      data={data[p1][p2]}
                                      viewed={p1 === store.viewedPrediction || p2 === store.viewedPrediction}/>
                            </Group>)}
                            {store.viewedPrediction !== -1 && !store.selectedPredictors.includes(store.viewedPrediction) &&
                                <Group x={store.selectedPredictors.length * (gridSize + gridGap)}>
                                    <Cell gridSize={gridSize}
                                          data={data[p1][store.viewedPrediction]}
                                          viewed/>
                                </Group>}
                            <Text text={(p1 + 1).toFixed(0)}
                                  x={-pl} width={pl}
                                  y={0} height={gridSize}
                                  align={'center'} verticalAlign={'middle'}/>
                        </Group>)}
                    </Group>)}
                </Group>
                <Group x={pl + (width - pl - pr) / 2 - matrixWidth / 2} y={0}>
                    {store.selectedPredictors.map((p2, p2Id) => <Group key={p2}
                                                                       x={p2Id * (gridSize + gridGap)}>
                        <Text text={(p2 + 1).toFixed(0)}
                              width={gridSize}
                              height={pt}
                              align={'center'} verticalAlign={'middle'}/>
                    </Group>)}
                    {store.viewedPrediction !== -1 && !store.selectedPredictors.includes(store.viewedPrediction) &&
                        <Group x={store.selectedPredictors.length * (gridSize + gridGap)}>
                            <Text text={(store.viewedPrediction + 1).toFixed(0)}
                                  width={gridSize}
                                  height={pt}
                                  align={'center'} verticalAlign={'middle'}/>
                        </Group>}
                </Group>
            </Layer>
        </Stage>
    </Container>
}

export default inject('store')(observer(PredictorsMatrix));

const Container = styled('div')({
    width: '100%', height: '100%', overflow: 'auto',
})