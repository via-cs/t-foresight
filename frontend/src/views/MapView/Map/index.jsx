import {inject, observer} from "mobx-react";
import {Layer, Stage} from "react-konva";
import useMapNavigation from "../Map/useMapNavigation.js";
import KonvaImage from "../../../components/KonvaImage.jsx";
import PlayerLayer from "../GameItems/PlayerLayer.jsx";
import RealTrajectoryLayer from "../Trajectories/RealTrajectoryLayer.jsx";
import StrategyRenderer from "../Heatmap/StrategyRenderer.jsx";
import {useEffect, useRef} from "react";
import PredictedTrajectoryLayer from "../Trajectories/PredictedTrajectoryLayer.jsx";
import {styled, useTheme} from "@mui/material/styles";

/**
 * @param {import('src/store/store.js').Store} store
 * @param {number} size
 * @constructor
 */
function MapRenderer({
                         store, size, onNav,
                     }) {
    const ref = useRef(null);
    const {
        scale,
        displayRange,
        autoFocus,
        handleWheel,
        handleRecover,
        dragBoundFunc,
        handleDragEnd
    } = useMapNavigation(size, ref);
    const scaleBalance = 2 / (scale + 1);

    useEffect(() => {
        onNav(displayRange.x, displayRange.y)
    }, [onNav, displayRange]);

    const theme = useTheme();

    return <Root>
        <Stage width={size} height={size}
               ref={n => ref.current = n}
               onWheel={handleWheel}
               onDblClick={handleRecover}
               fill={'black'}
               draggable
               onDragEnd={handleDragEnd}
               dragBoundFunc={dragBoundFunc}>
            <Layer>
                <KonvaImage src={store.mapImage} w={size} h={size}/>
            </Layer>
            {store.selectedPredictors.length !== 0 && store.comparedPredictors.length === 0 &&
                <StrategyRenderer mapSize={size}
                                  strat={store.selectedPredictorsAsAStrategy}
                                  onAutoFocus={autoFocus}/>}
            <PredictedTrajectoryLayer mapSize={size}
                                      scaleBalance={scaleBalance}/>
            {store.focusedPlayer !== -1 &&
                <RealTrajectoryLayer mapSize={size}
                                     scaleBalance={scaleBalance}
                                     onAutoFocus={autoFocus}/>}
            <PlayerLayer mapSize={size} scaleBalance={scaleBalance}/>
        </Stage>
    </Root>
}

export default inject('store')(observer(MapRenderer))

const Root = styled('div')({
    position: 'relative',
})
