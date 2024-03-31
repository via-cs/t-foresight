import {inject, observer} from "mobx-react";
import {Layer, Stage} from "react-konva";
import {styled} from "@mui/material/styles";
import useAxisRange from "./useAxisRange.js";
import MapContextMatrix from "./Matrix.jsx";
import MapContextCorner from "./Corner.jsx";
import useGeneralDir from "./useGeneralDir.js";
import useKeyPressed from "../../../utils/useKeyPressed.js";
import {unionSet} from "../../../utils/set.js";
import {useState} from "react";

const space = 3;
const amp = 10;
const arrowSize = 0.7;
const minGridSize = 20;
const autoDecideNumGrid = (size, timeStep) => Math.floor((size + space) / (minGridSize + space) - timeStep);

/**
 *
 * @param {import('src/store/store.js').Store} store
 * @param size
 * @param mapRenderer
 * @param numGrid
 * @param timeStep
 * @return {JSX.Element}
 * @constructor
 */
function MapContext({store, size, mapRenderer, numGrid = -1, timeStep = 5}) {
    if (numGrid === -1) numGrid = autoDecideNumGrid(size, timeStep);
    const disStep = (size + space) / (numGrid + timeStep);
    const gridSize = disStep - space;
    const mapSize = disStep * numGrid - space;

    const [gridVariant, setGridVariant] = useState('rect');
    const toggleGridVariant = () => setGridVariant(v => v === 'rect' ? 'circle' : 'rect');

    const {xRange, yRange, onNav} = useAxisRange();
    const [xSel, ySel] = store.trajStat(xRange, yRange, numGrid, timeStep, store.selectedPredictorsAsAStrategy);
    const [xComp, yComp] = store.trajStat(xRange, yRange, numGrid, timeStep, store.comparedPredictorsAsAStrategy);
    const [xView, yView] = store.trajStat(xRange, yRange, numGrid, timeStep, store.viewedPredictorsAsAStrategy);
    const [curPosX, curPosY] = store.focusedPlayerPosition;

    const generalDir = useGeneralDir(xSel, ySel);

    const shift = useKeyPressed('Shift');

    const handleViewX = (g, t) => {
        store.viewPredictions(Array.from(unionSet([xSel[g][t].predictionIdxes, xComp[g][t].predictionIdxes])));
        store.setViewedTime(t + 1);
    }
    const handleViewY = (g, t) => {
        store.viewPredictions(Array.from(unionSet([ySel[g][t].predictionIdxes, yComp[g][t].predictionIdxes])));
        store.setViewedTime(t + 1);
    }
    const handleClearView = () => {
        store.viewPredictions([]);
        store.setViewedTime(-1);
    }

    const handleSelectX = (g, t) => store.selectPredictors(Array.from(unionSet([xSel[g][t].predictionIdxes, xComp[g][t].predictionIdxes])), Number(shift));
    const handleSelectY = (g, t) => store.selectPredictors(Array.from(unionSet([ySel[g][t].predictionIdxes, yComp[g][t].predictionIdxes])), Number(shift));

    return <Root>
        <Stage width={size} height={size}>
            <Layer>
                {generalDir.startsWith('t') &&
                    <MapContextMatrix numGrid={numGrid} timeStep={timeStep}
                                      x={generalDir.endsWith('l') ? timeStep * disStep : 0} y={0} direction={'top'}
                                      gridSize={gridSize} space={space}
                                      gridVariant={gridVariant}
                                      data={xSel} compData={xComp} viewData={xView}
                                      curPos={curPosX} range={xRange}
                                      selectedPredictions={store.selectedPredictors}
                                      comparedPredictions={store.comparedPredictors}
                                      viewedPredictions={store.viewedPredictions}
                                      onEnter={handleViewX}
                                      onLeave={handleClearView}
                                      onClick={handleSelectX}/>}
                {generalDir.endsWith('l') &&
                    <MapContextMatrix numGrid={numGrid} timeStep={timeStep}
                                      x={0} y={generalDir.startsWith('t') ? timeStep * disStep : 0} direction={'left'}
                                      gridSize={gridSize} space={space}
                                      gridVariant={gridVariant}
                                      data={ySel} compData={yComp} viewData={yView}
                                      curPos={curPosY} range={yRange}
                                      selectedPredictions={store.selectedPredictors}
                                      comparedPredictions={store.comparedPredictors}
                                      viewedPredictions={store.viewedPredictions}
                                      onEnter={handleViewY}
                                      onLeave={handleClearView}
                                      onClick={handleSelectY}/>}
                {generalDir.endsWith('r') &&
                    <MapContextMatrix numGrid={numGrid} timeStep={timeStep}
                                      x={mapSize + space} y={generalDir.startsWith('t') ? timeStep * disStep : 0}
                                      direction={'right'}
                                      gridSize={gridSize} space={space}
                                      gridVariant={gridVariant}
                                      data={ySel} compData={yComp} viewData={yView}
                                      curPos={curPosY} range={yRange}
                                      selectedPredictions={store.selectedPredictors}
                                      comparedPredictions={store.comparedPredictors}
                                      viewedPredictions={store.viewedPredictions}
                                      onEnter={handleViewY}
                                      onLeave={handleClearView}
                                      onClick={handleSelectY}/>}
                {generalDir.startsWith('b') &&
                    <MapContextMatrix numGrid={numGrid} timeStep={timeStep}
                                      x={generalDir.endsWith('l') ? timeStep * disStep : 0} y={mapSize + space}
                                      direction={'bottom'}
                                      gridSize={gridSize} space={space}
                                      gridVariant={gridVariant}
                                      data={xSel} compData={xComp} viewData={xView}
                                      curPos={curPosX} range={xRange}
                                      selectedPredictions={store.selectedPredictors}
                                      comparedPredictions={store.comparedPredictors}
                                      viewedPredictions={store.viewedPredictions}
                                      onEnter={handleViewX}
                                      onLeave={handleClearView}
                                      onClick={handleSelectX}/>}
                {generalDir === 'tl' &&
                    <MapContextCorner timeStep={timeStep}
                                      onViewTime={store.setViewedTime}
                                      onClick={toggleGridVariant}
                                      gridSize={gridSize} space={space} direction={'tl'}
                                      x={timeStep * disStep} y={timeStep * disStep}/>}
                {generalDir === 'tr' &&
                    <MapContextCorner timeStep={timeStep}
                                      onViewTime={store.setViewedTime}
                                      onClick={toggleGridVariant}
                                      gridSize={gridSize} space={space} direction={'tr'}
                                      x={mapSize} y={timeStep * disStep}/>}
                {generalDir === 'bl' &&
                    <MapContextCorner timeStep={timeStep}
                                      onViewTime={store.setViewedTime}
                                      onClick={toggleGridVariant}
                                      gridSize={gridSize} space={space} direction={'bl'}
                                      x={timeStep * disStep} y={mapSize}/>}
                {generalDir === 'br' &&
                    <MapContextCorner timeStep={timeStep}
                                      onViewTime={store.setViewedTime}
                                      onClick={toggleGridVariant}
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