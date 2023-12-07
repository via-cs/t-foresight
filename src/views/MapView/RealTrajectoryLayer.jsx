import {inject, observer} from "mobx-react";
import {Arrow, Layer} from "react-konva";
import {mapDis, mapProject} from "../../utils/game.js";
import {useEffect} from "react";

/**
 * @param {import('src/store/store').Store} store
 * @param {number} mapSize
 * @param {number} scaleBalance
 * @returns {JSX.Element}
 * @constructor
 */
function RealTrajectoryLayer({store, mapSize, scaleBalance, onAutoFocus}) {
    // 0. I have added some example files with some comments.
    //    You can find the file list in README.md.

    // 1. You can get the trajectory of the selected player from store here.
    //    You can refer to store.playerPositions, where I get the current positions of all players.
    //    But you need to get several future positions of the selected player.
    //    e.g., const trajectory = store.selectedPlayerTrajectory;

    //player current position
    const playerPositions = store.playerPositions;
    //current frame
    const curfra = store.curFrame;
    // selected player trajectory
    const tra = store.selectedPlayerTrajectory;
    const transformedTrajectory = tra.map(point => mapProject(point, mapSize));
    const points = transformedTrajectory.flatMap(([x, y]) => [Math.max(x * 0.02 * scaleBalance, x), Math.max(y * 0.02 * scaleBalance, y)]);
    const windowedPoints = points.slice(store.trajTimeWindow[0] * 2 + 900, store.trajTimeWindow[1] * 2 + 900);

    useEffect(() => {
        const centerPos = store.playerPositions[store.focusedTeam][store.focusedPlayer];
        const radius = Math.max(...tra.map(pos => mapDis(pos, centerPos)));
        onAutoFocus && onAutoFocus(centerPos, radius);
    }, [store.selectedPlayerTrajectory]);

    // console.log(points);
    // 2. You can render the trajectory here.
    //    You may want to refer to:
    //    - how to draw a simple shape: https://konvajs.org/docs/react/Shapes.html and
    //    - the API documentation of an arrow shape: https://konvajs.org/api/Konva.Arrow.html

    var alltra = store.allPlayerTrajectory;
    return <Layer>
        <Arrow points={points}
               stroke={store.curColor} // Line color
               strokeWidth={3 * scaleBalance} // Line width
               pointerAtEnding={true}
               fill='red'
               pointerLength={15 * scaleBalance} // Adjust for smaller arrowhead length
               pointerWidth={10 * scaleBalance} // Adjust for smaller arrowhead width
               opacity={0.4}
        />
        <Arrow points={windowedPoints}
               stroke={store.curColor} // Line color
               strokeWidth={3 * scaleBalance} // Line width
               pointerAtEnding={true}
               fill={'red'}
               pointerWidth={10 * scaleBalance}
               pointerLength={15 * scaleBalance}/>
    </Layer>
}


export default inject('store')(observer(RealTrajectoryLayer))
