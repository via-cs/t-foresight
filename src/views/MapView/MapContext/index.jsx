import {inject, observer} from "mobx-react";
import {Layer, Stage} from "react-konva";
import {styled} from "@mui/material/styles";
import useAxisRange from "./useAxisRange.js";
import MapContextMatrix from "./Matrix.jsx";
import MapContextCorner from "./Corner.jsx";
import useGeneralDir from "./useGeneralDir.js";

const space = 3;
const amp = 10;
const arrowSize = 0.7;

function MapContext({store, size, mapRenderer, numGrid = 50, timeStep = 5}) {
    const disStep = (size + space) / (numGrid + timeStep);
    const gridSize = disStep - space;
    const mapSize = disStep * numGrid - space;

    const {xRange, yRange, onNav} = useAxisRange();
    const [xData, yData] = store.trajStat(xRange, yRange, numGrid, timeStep);
    const [curPosX, curPosY] = store.focusedPlayerPosition;

    const generalDir = useGeneralDir(xData, yData);

    return <Root>
        <Stage width={size} height={size}>
            <Layer>
                {generalDir.startsWith('t') &&
                    <MapContextMatrix numGrid={numGrid} timeStep={timeStep}
                                      x={generalDir.endsWith('l') ? timeStep * disStep : 0} y={0} direction={'top'}
                                      gridSize={gridSize} space={space} arrowSize={arrowSize}
                                      data={xData}
                                      color={store.curColor} amp={amp}
                                      curPos={curPosX} range={xRange}
                                      viewedPredictions={[store.viewedPrediction]}
                                      onEnter={console.log}
                                      onLeave={console.log}
                                      onClick={console.log}/>}
                {generalDir.endsWith('l') &&
                    <MapContextMatrix numGrid={numGrid} timeStep={timeStep}
                                      x={0} y={generalDir.startsWith('t') ? timeStep * disStep : 0} direction={'left'}
                                      gridSize={gridSize} space={space} arrowSize={arrowSize}
                                      data={yData}
                                      color={store.curColor} amp={amp}
                                      curPos={curPosY} range={yRange}
                                      viewedPredictions={[store.viewedPrediction]}
                                      onEnter={console.log}
                                      onLeave={console.log}
                                      onClick={console.log}/>}
                {generalDir.endsWith('r') &&
                    <MapContextMatrix numGrid={numGrid} timeStep={timeStep}
                                      x={mapSize + space} y={generalDir.startsWith('t') ? timeStep * disStep : 0}
                                      direction={'right'}
                                      gridSize={gridSize} space={space} arrowSize={arrowSize}
                                      data={yData}
                                      color={store.curColor} amp={amp}
                                      curPos={curPosY} range={yRange}
                                      viewedPredictions={[store.viewedPrediction]}
                                      onEnter={console.log}
                                      onLeave={console.log}
                                      onClick={console.log}/>}
                {generalDir.startsWith('b') &&
                    <MapContextMatrix numGrid={numGrid} timeStep={timeStep}
                                      x={generalDir.endsWith('l') ? timeStep * disStep : 0} y={mapSize + space}
                                      direction={'bottom'}
                                      gridSize={gridSize} space={space} arrowSize={arrowSize}
                                      data={xData}
                                      color={store.curColor} amp={amp}
                                      curPos={curPosX} range={xRange}
                                      viewedPredictions={[store.viewedPrediction]}
                                      onEnter={console.log}
                                      onLeave={console.log}
                                      onClick={console.log}/>}
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