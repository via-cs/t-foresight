import {Arrow, Layer} from "react-konva";
import {mapProject} from "../../utils/game.js";

function PredictedTrajectoryLayer({mapSize, scaleBalance, prediction, color}) {
    const traj = prediction.map(p => mapProject(p, mapSize));
    return <Layer>
        <Arrow points={traj.flat()}
               stroke={color} strokeWidth={mapSize * 0.007 * scaleBalance} dash={[5, 5]}
               fill={color}
               pointerWidth={mapSize * 0.02 * scaleBalance} pointerLength={mapSize * 0.02 * scaleBalance}/>
    </Layer>
}

export default PredictedTrajectoryLayer;
