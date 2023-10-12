import {inject, observer} from "mobx-react";
import {Layer, Stage} from "react-konva";
import useMapNavigation from "./useMapNavigation.js";
import KonvaImage from "../../components/KonvaImage.jsx";

/**
 * @param {number} size
 * @param {Function<{scaleBalance: number}, ReactNode>[]} layers : scaleBalance is used to avoid some elements scaled with the whole map
 * @constructor
 */
function MapRenderer({
                         size,
                         layers,
                     }) {
    const {scale, offset, handleWheel, handleRecover, dragBoundFunc} = useMapNavigation(size);

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
        {layers.map((layer, lId) => <Layer key={lId}>
            {layer({
                scaleBalance: 2 / (scale + 1)
            })}
        </Layer>)}
    </Stage>
}

export default inject('store')(observer(MapRenderer))
