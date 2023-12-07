import {Arrow, Layer} from "react-konva";
import {mapProject} from "../../../utils/game.js";

function PredictedTrajectoryLayer({mapSize, scaleBalance, prediction, color}) {
    const traj = prediction.map(p => mapProject(p, mapSize));
    return <Layer>
        <Arrow points={traj.flat()}
               strokeWidth={2 * scaleBalance} // Line width
               pointerWidth={7 * scaleBalance}
               pointerLength={7 * scaleBalance}
               stroke={color} dash={[5, 5]}
               fill={color}/>
    </Layer>
}

export default PredictedTrajectoryLayer;
