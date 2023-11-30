import {inject, observer} from "mobx-react";
import {Layer, Stage} from "react-konva";
import useMapNavigation from "./useMapNavigation.js";
import KonvaImage from "../../components/KonvaImage.jsx";
import PlayerLayer from "./PlayerLayer.jsx";
import RealTrajectoryLayer from "./RealTrajectoryLayer.jsx";
import StrategyRenderer from "./StrategyRenderer.jsx";
import {useRef} from "react";
import PredictedTrajectoryLayer from "./PredictedTrajectoryLayer.jsx";

/**
 * @param {import('src/store/store.js').Store} store
 * @param {number} size
 * @constructor
 */
function MapRenderer({
                         store,
                         size,
                     }) {
    const ref = useRef(null);
    const {scale, autoFocus, handleWheel, handleRecover, dragBoundFunc} = useMapNavigation(size, ref);
    const scaleBalance = 2 / (scale + 1);

    return <Stage width={size} height={size}
                  ref={n => ref.current = n}
                  onWheel={handleWheel}
                  onDblClick={handleRecover}
                  fill={'black'}
                  draggable
                  dragBoundFunc={dragBoundFunc}>
        <Layer>
            <KonvaImage src={'./map.jpeg'} w={size} h={size}/>
        </Layer>
        {store.selectedPredictorsAsAStrategy &&
            <StrategyRenderer mapSize={size}
                              strat={store.selectedPredictorsAsAStrategy}
                              onAutoFocus={autoFocus}/>}
        {store.viewedPrediction !== -1 &&
            <PredictedTrajectoryLayer mapSize={size}
                                      scaleBalance={scaleBalance}
                                      prediction={store.predictions[store.viewedPrediction].trajectory}
                                      color={store.curColor}/>}
        {store.focusedPlayer !== -1 &&
            <RealTrajectoryLayer mapSize={size} scaleBalance={scaleBalance}/>}
        <PlayerLayer mapSize={size} scaleBalance={scaleBalance}/>
    </Stage>
}

export default inject('store')(observer(MapRenderer))
