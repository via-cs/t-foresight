import {inject, observer} from "mobx-react";
import {Arrow, Group, Layer, Line, Rect, Stage, Text} from "react-konva";
import {styled, useTheme} from "@mui/material/styles";
import useAxisRange from "./useAxisRange.js";
import {alpha} from "@mui/material";
import newArr from "../../../utils/newArr.js";

const space = 3;
const amp = 10;
const arrowSize = 0.7;
const rot = vec => Math.atan(-vec[1] / vec[0]) / Math.PI * 180 - (vec[0] < 0 ? 180 : 0)

function MapContext({store, size, mapRenderer, numGrid = 50, timeStep = 5}) {
    const gridArr = newArr(numGrid, g => newArr(timeStep, t => [g, t])).flat();
    const disStep = (size + space) / (numGrid + timeStep);
    const gridSize = disStep - space;
    const mapSize = disStep * numGrid - space;

    const theme = useTheme();
    const {xRange, yRange, onNav} = useAxisRange();
    const [xData, yData] = store.trajStat(xRange, yRange, numGrid, timeStep);
    const [curPosX, curPosY] = store.focusedPlayerPosition;
    const handleViewPrediction = pred => console.log(pred);

    return <Root>
        <Stage width={size} height={size}>
            <Layer>
                {/*top matrix*/}
                <Group x={timeStep * disStep}>
                    {gridArr.map(([g, t]) => (
                        <Group key={`${g},${t}`}
                               x={g * disStep + gridSize / 2}
                               y={(timeStep - t - 1) * disStep + gridSize / 2}
                               onMouseEnter={() => handleViewPrediction(xData[g][t][2])}
                               onMouseLeave={() => handleViewPrediction([])}>
                            <Rect x={-gridSize / 2} width={gridSize}
                                  y={-gridSize / 2} height={gridSize}
                                  stroke={theme.palette.background.default} strokeWidth={2}
                                  fill={alpha(store.curColor || '#fff', Math.min(1, xData[g][t][0] * amp))}/>
                            {(store.viewedPrediction === -1 || xData[g][t][2].has(store.viewedPrediction)) &&
                                <Arrow stroke={'#fff'} strokeWidth={1}
                                       pointerWidth={4 * arrowSize}
                                       pointerLength={4 * arrowSize}
                                       points={[-gridSize / 2 * arrowSize, 0, gridSize / 2 * arrowSize, 0]}
                                       rotation={rot(xData[g][t][1])}/>}
                        </Group>
                    ))}
                    {curPosX > xRange[0] && curPosX < xRange[1] &&
                        <Line stroke={store.curColor} strokeWidth={2}
                              points={[
                                  mapSize * (curPosX - xRange[0]) / (xRange[1] - xRange[0]), 0,
                                  mapSize * (curPosX - xRange[0]) / (xRange[1] - xRange[0]), timeStep * disStep,
                              ]}/>}
                </Group>
                <Group y={timeStep * disStep}>
                    {gridArr.map(([g, t]) => (
                        <Group key={`${g},${t}`}
                               x={(timeStep - t - 1) * disStep + gridSize / 2}
                               y={(numGrid - g - 1) * disStep + gridSize / 2}
                               onMouseEnter={() => handleViewPrediction(yData[g][t][2])}
                               onMouseLeave={() => handleViewPrediction([])}>
                            <Rect x={-gridSize / 2} width={gridSize}
                                  y={-gridSize / 2} height={gridSize}
                                  stroke={theme.palette.background.default} strokeWidth={2}
                                  fill={alpha(store.curColor || '#fff', Math.min(1, yData[g][t][0] * amp))}/>
                            {(store.viewedPrediction === -1 || yData[g][t][2].has(store.viewedPrediction)) &&
                                <Arrow stroke={'#fff'} strokeWidth={1}
                                       pointerWidth={4 * arrowSize} pointerLength={4 * arrowSize}
                                       points={[-gridSize / 2 * arrowSize, 0, gridSize / 2 * arrowSize, 0]}
                                       rotation={rot(yData[g][t][1])}/>}
                        </Group>
                    ))}
                    {curPosY > yRange[0] && curPosY < yRange[1] &&
                        <Line stroke={store.curColor} strokeWidth={2}
                              points={[
                                  0, mapSize * (yRange[1] - curPosY) / (yRange[1] - yRange[0]),
                                  timeStep * disStep, mapSize * (yRange[1] - curPosY) / (yRange[1] - yRange[0]),
                              ]}/>}
                </Group>
                {/*right matrix*/}
                {/*<Group x={timeStep * disStep + mapSize + space} y={timeStep * disStep}>*/}
                {/*    {gridArr.map(([g, t]) => (*/}
                {/*        <Rect key={`${g},${t}`}*/}
                {/*              x={t * disStep} width={gridSize}*/}
                {/*              y={g * disStep} height={gridSize}*/}
                {/*              stroke={theme.palette.background.default} strokeWidth={2}/>*/}
                {/*    ))}*/}
                {/*</Group>*/}
                {/*bottom matrix*/}
                {/*<Group x={timeStep * disStep} y={timeStep * disStep + mapSize + space}>*/}
                {/*    {gridArr.map(([g, t]) => (*/}
                {/*        <Rect key={`${g},${t}`}*/}
                {/*              x={g * disStep} width={gridSize}*/}
                {/*              y={t * disStep} height={gridSize}*/}
                {/*              stroke={theme.palette.background.default} strokeWidth={2}/>*/}
                {/*    ))}*/}
                {/*</Group>*/}
                {/*left matrix*/}

                {newArr(timeStep, i => (
                    <Group key={i}>
                        <Line stroke={theme.palette.background.default} strokeWidth={2}
                              points={[
                                  (timeStep - i - 1) * disStep + gridSize / 2, timeStep * disStep,
                                  (timeStep - i - 1) * disStep + gridSize / 2, (timeStep - i - 1) * disStep + gridSize / 2,
                                  timeStep * disStep, (timeStep - i - 1) * disStep + gridSize / 2,
                              ]}/>
                        <Rect x={(timeStep - i - 1) * disStep + gridSize / 2 - 10} width={20}
                              y={(timeStep - i - 1) * disStep + gridSize / 2 - 8} height={16}
                              fill={'#fff'}/>
                        <Text x={(timeStep - i - 1) * disStep + gridSize / 2 - 10} width={20}
                              y={(timeStep - i - 1) * disStep + gridSize / 2 - 8} height={16}
                              align={'center'} verticalAlign={'middle'}
                              text={`${i + 1}s`}/>
                    </Group>
                ))}
            </Layer>
        </Stage>
        <MapContainer style={{left: timeStep * disStep, top: timeStep * disStep, width: mapSize, height: mapSize}}>
            {mapRenderer(mapSize, onNav)}
        </MapContainer>
    </Root>
}

export default inject('store')(observer(MapContext));

const Root = styled('div')({
    position: 'relative',
})

const MapContainer = styled('div')({
    position: 'absolute',
    overflow: 'hidden',
})