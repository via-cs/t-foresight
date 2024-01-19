import {inject, observer} from "mobx-react";
import {Group, Layer} from "react-konva";
import {selectionColor} from "../../../utils/theme.js";
import {useTheme} from "@mui/material/styles";
import Traj from "./Traj.jsx";

function ArrowGroup({trajectories, color, mapSize, scaleBalance, labelStyle = 'dot'}) {
    return <Group>
        {trajectories.map((traj, tId) => (
            <Traj key={tId}
                  traj={traj}
                  mapSize={mapSize}
                  scaleBalance={scaleBalance}
                  color={color}
                  labelStyle={labelStyle}
                  timeRange={[0, 150]}/>
        ))}
    </Group>
}

function PredictedTrajectoryLayer({store, mapSize, scaleBalance}) {
    const getPredictionTraj = i => store.predictions[i].trajectory;
    const theme = useTheme();

    return (
        <Layer>
            <ArrowGroup scaleBalance={scaleBalance}
                        color={selectionColor[0]}
                        mapSize={mapSize}
                        trajectories={store.selectedPredictors.map(getPredictionTraj)}
                        timeRange={[0, 150]}/>
            <ArrowGroup scaleBalance={scaleBalance}
                        color={selectionColor[1]}
                        mapSize={mapSize}
                        trajectories={store.comparedPredictors.map(getPredictionTraj)}
                        timeRange={[0, 150]}/>
            <ArrowGroup scaleBalance={scaleBalance}
                        color={theme.palette.secondary.main}
                        mapSize={mapSize}
                        labelStyle={'time'}
                        trajectories={store.viewedPredictions.map(getPredictionTraj)}
                        timeRange={[0, 150]}/>
        </Layer>
    );
}

export default inject('store')(observer(PredictedTrajectoryLayer));
