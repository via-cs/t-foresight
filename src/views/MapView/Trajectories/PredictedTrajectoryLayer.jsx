import {inject, observer} from "mobx-react";
import {Arrow, Group, Layer} from "react-konva";
import {mapProject} from "../../../utils/game.js";
import {selectionColor} from "../../../utils/theme.js";
import {useTheme} from "@mui/material/styles";

function ArrowGroup({trajectories, color, scaleBalance}) {
    return <Group>
        {trajectories.map((traj, tId) => (
            <Arrow key={tId}
                   points={traj.flat()}
                   strokeWidth={3 * scaleBalance} // Line width
                   pointerWidth={7 * scaleBalance}
                   pointerLength={7 * scaleBalance}
                   stroke={color} dash={[5, 5]}
                   fill={color}
                   opacity={1}/>
        ))}
    </Group>
}

function PredictedTrajectoryLayer({store, mapSize, scaleBalance}) {
    const getPredictionTraj = i => store.predictions[i].trajectory.map(p => mapProject(p, mapSize));
    const theme = useTheme();

    return (
        <Layer>
            <ArrowGroup scaleBalance={scaleBalance}
                        color={selectionColor[0]}
                        trajectories={store.selectedPredictors.map(getPredictionTraj)}/>
            <ArrowGroup scaleBalance={scaleBalance}
                        color={selectionColor[1]}
                        trajectories={store.comparedPredictors.map(getPredictionTraj)}/>
            <ArrowGroup scaleBalance={scaleBalance}
                        color={theme.palette.secondary.main}
                        trajectories={store.viewedPredictions.map(getPredictionTraj)}/>
        </Layer>
    );
}

export default inject('store')(observer(PredictedTrajectoryLayer));
