import {inject, observer} from "mobx-react";
import {Layer, Stage} from "react-konva";
import {styled} from "@mui/material/styles";
import useAxisRange from "./useAxisRange.js";
import MapContextMatrix from "./Matrix.jsx";
import MapContextCorner from "./Corner.jsx";
import useGeneralDir from "./useGeneralDir.js";
import useKeyPressed from "../../../utils/useKeyPressed.js";

const space = 3;
const amp = 10;
const arrowSize = 0.7;
const minGridSize = 20;
const autoDecideNumGrid = (size, timeStep) => Math.floor((size + space) / (minGridSize + space) - timeStep);

function MapContext({store, size, mapRenderer, numGrid = -1, timeStep = 5}) {
    if (numGrid === -1) numGrid = autoDecideNumGrid(size, timeStep);
    const disStep = (size + space) / (numGrid + timeStep);
    const gridSize = disStep - space;
    const mapSize = disStep * numGrid - space;

    const {xRange, yRange, onNav} = useAxisRange();
    const [xData, yData] = store.trajStat(xRange, yRange, numGrid, timeStep);
    const [curPosX, curPosY] = store.focusedPlayerPosition;

    const generalDir = useGeneralDir(xData, yData);

    const shift = useKeyPressed('Shift');

    return <Root>
        <Stage width={size} height={size}>
            <Layer>
                {generalDir.startsWith('t') &&
                    <MapContextMatrix numGrid={numGrid} timeStep={timeStep}
                                      x={generalDir.endsWith('l') ? timeStep * disStep : 0} y={0} direction={'top'}
                                      gridSize={gridSize} space={space} arrowSize={arrowSize}
                                      data={xData} amp={amp}
                                      curPos={curPosX} range={xRange}
                                      viewedPredictions={store.viewedPredictions}
                                      onEnter={(_, __, d) => store.viewPredictions(Array.from(d[2]))}
                                      onLeave={() => store.viewPredictions([])}
                                      onClick={(_, __, d) => store.selectPredictors(Array.from(d[2]), Number(shift))}/>}
                {generalDir.endsWith('l') &&
                    <MapContextMatrix numGrid={numGrid} timeStep={timeStep}
                                      x={0} y={generalDir.startsWith('t') ? timeStep * disStep : 0} direction={'left'}
                                      gridSize={gridSize} space={space} arrowSize={arrowSize}
                                      data={yData} amp={amp}
                                      curPos={curPosY} range={yRange}
                                      viewedPredictions={store.viewedPredictions}
                                      onEnter={(_, __, d) => store.viewPredictions(Array.from(d[2]))}
                                      onLeave={() => store.viewPredictions([])}
                                      onClick={(_, __, d) => store.selectPredictors(Array.from(d[2]), Number(shift))}/>}
                {generalDir.endsWith('r') &&
                    <MapContextMatrix numGrid={numGrid} timeStep={timeStep}
                                      x={mapSize + space} y={generalDir.startsWith('t') ? timeStep * disStep : 0}
                                      direction={'right'}
                                      gridSize={gridSize} space={space} arrowSize={arrowSize}
                                      data={yData} amp={amp}
                                      curPos={curPosY} range={yRange}
                                      viewedPredictions={store.viewedPredictions}
                                      onEnter={(_, __, d) => store.viewPredictions(Array.from(d[2]))}
                                      onLeave={() => store.viewPredictions([])}
                                      onClick={(_, __, d) => store.selectPredictors(Array.from(d[2]), Number(shift))}/>}
                {generalDir.startsWith('b') &&
                    <MapContextMatrix numGrid={numGrid} timeStep={timeStep}
                                      x={generalDir.endsWith('l') ? timeStep * disStep : 0} y={mapSize + space}
                                      direction={'bottom'}
                                      gridSize={gridSize} space={space} arrowSize={arrowSize}
                                      data={xData} amp={amp}
                                      curPos={curPosX} range={xRange}
                                      viewedPredictions={store.viewedPredictions}
                                      onEnter={(_, __, d) => store.viewPredictions(Array.from(d[2]))}
                                      onLeave={() => store.viewPredictions([])}
                                      onClick={(_, __, d) => store.selectPredictors(Array.from(d[2]), Number(shift))}/>}
                {generalDir === 'tl' &&
                    <MapContextCorner timeStep={timeStep}
                                      gridSize={gridSize} space={space} direction={'tl'}
                                      x={timeStep * disStep} y={timeStep * disStep}/>}
                {generalDir === 'tr' &&
                    <MapContextCorner timeStep={timeStep}
                                      gridSize={gridSize} space={space} direction={'tr'}
                                      x={mapSize} y={timeStep * disStep}/>}
                {generalDir === 'bl' &&
                    <MapContextCorner timeStep={timeStep}
                                      gridSize={gridSize} space={space} direction={'bl'}
                                      x={timeStep * disStep} y={mapSize}/>}
                {generalDir === 'br' &&
                    <MapContextCorner timeStep={timeStep}
                                      gridSize={gridSize} space={space} direction={'br'}
                                      x={mapSize}
                                      y={mapSize}/>}
            </Layer>
        </Stage>
        <MapContainer style={{
            left: generalDir.endsWith('l') ? timeStep * disStep : 0,
            top: generalDir.startsWith('t') ? timeStep * disStep : 0,
            width: mapSize,
            height: mapSize
        }}>
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