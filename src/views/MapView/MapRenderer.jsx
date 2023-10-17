import {inject, observer} from "mobx-react";
import {Layer, Stage} from "react-konva";
import useMapNavigation from "./useMapNavigation.js";
import KonvaImage from "../../components/KonvaImage.jsx";
import PlayerLayer from "./PlayerLayer.jsx";
import RealTrajectoryLayer from "./RealTrajectoryLayer.jsx";

/**
 * @param {import('src/store/store.js').Store} store
 * @param {number} size
 * @constructor
 */
function MapRenderer({
                         store,
                         size,
                     }) {
    const {scale, offset, handleWheel, handleRecover, dragBoundFunc} = useMapNavigation(size);
    const scaleBalance = 2 / (scale + 1);

    return <Stage width={size} height={size}
                  scaleX={scale} scaleY={scale}
                  x={offset[0]} y={offset[1]}
                  onWheel={handleWheel}
                  onDblClick={handleRecover}
                  fill={'black'}
                  draggable
                  dragBoundFunc={dragBoundFunc}>
        <Layer>
            <KonvaImage src={'./map.jpeg'} w={size} h={size}/>
        </Layer>

        {store.focusedPlayer !== -1 &&
            <RealTrajectoryLayer mapSize={mapSize} scaleBalance={scaleBalance}/>}
        <PlayerLayer mapSize={mapSize} scaleBalance={scaleBalance}/>
    </Stage>
}

export default inject('store')(observer(MapRenderer))
