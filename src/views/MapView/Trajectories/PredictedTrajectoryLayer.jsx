import { inject, observer } from "mobx-react";
import {Arrow, Layer} from "react-konva";
import {mapProject} from "../../../utils/game.js";

function PredictedTrajectoryLayer({store, mapSize, scaleBalance, prediction, color}) {
    const arrows = [];
    const predLen = store.selectedPredictorsAsAStrategy.predictors.length;
    for(var i = 0; i <= predLen-1; i++) {

        const traj = store.selectedPredictorsAsAStrategy.predictors[i].trajectory.map(p => mapProject(p, mapSize));
        var arrow = (
            <Arrow 
            key={i}
            points={traj.flat()}
            strokeWidth={3 * scaleBalance} // Line width
            pointerWidth={7 * scaleBalance}
            pointerLength={7 * scaleBalance}
            stroke={color} dash={[5, 5]}
            fill={color}
            opacity={0.6}/>
        );
        arrows.push(arrow);
    }
    const selectedTraj = prediction.map(p => mapProject(p, mapSize));
    return (
        <Layer>
            {arrows}
            <Arrow points={selectedTraj.flat()}
                strokeWidth={3 * scaleBalance} // Line width
                pointerWidth={7 * scaleBalance}
                pointerLength={7 * scaleBalance}
                stroke={'white'} dash={[5, 5]}
                fill={'white'}/>
        </Layer>
    );
}

export default inject('store')(observer(PredictedTrajectoryLayer));
