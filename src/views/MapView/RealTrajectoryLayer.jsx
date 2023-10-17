import {inject, observer} from "mobx-react";
import {Layer} from "react-konva";

/**
 * @param {import('src/store/store').Store} store
 * @param {number} mapSize
 * @param {number} scaleBalance
 * @returns {JSX.Element}
 * @constructor
 */
function RealTrajectoryLayer({store, mapSize, scaleBalance}) {
    // 1. You can get the trajectory of the selected player from store here
    //    e.g., const trajectory = store.selectedPlayerTrajectory;

    // 2. You can render the trajectory here.
    //    You may want to refer to https://konvajs.org/api/Konva.Arrow.html
    return <Layer>

    </Layer>
}

export default inject('store')(observer(RealTrajectoryLayer))
