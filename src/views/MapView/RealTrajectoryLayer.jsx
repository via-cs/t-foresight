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
    // 0. I have added some example files with some comments.
    //    You can find the file list in README.md.

    // 1. You can get the trajectory of the selected player from store here.
    //    You can refer to store.playerPositions, where I get the current positions of all players.
    //    But you need to get several future positions of the selected player.
    //    e.g., const trajectory = store.selectedPlayerTrajectory;

    // 2. You can render the trajectory here.
    //    You may want to refer to:
    //    - how to draw a simple shape: https://konvajs.org/docs/react/Shapes.html and
    //    - the API documentation of an arrow shape: https://konvajs.org/api/Konva.Arrow.html
    return <Layer>

    </Layer>
}

export default inject('store')(observer(RealTrajectoryLayer))
