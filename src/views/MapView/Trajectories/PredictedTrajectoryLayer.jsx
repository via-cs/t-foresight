import {inject, observer} from "mobx-react";
import {Group, Layer} from "react-konva";
import {selectionColor} from "../../../utils/theme.js";
import {useTheme} from "@mui/material/styles";
import Traj from "./Traj.jsx";
import {useCallback} from "react";

function ArrowGroup({
                        trajectories,
                        color,
                        listening,
                        mapSize,
                        scaleBalance,
                        onMouseEnter,
                        onMouseLeave,
                        labelStyle = 'dot'
                    }) {
    return <Group listening={listening}>
        {trajectories.map((traj, tId) => (
            <Traj key={tId}
                  traj={traj.trajectory}
                  id={traj.idx}
                  mapSize={mapSize}
                  scaleBalance={scaleBalance}
                  color={color}
                  labelStyle={labelStyle}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  timeRange={[0, 150]}/>
        ))}
    </Group>
}

function PredictedTrajectoryLayer({store, mapSize, scaleBalance}) {
    const getPredictionTraj = i => store.predictions[i];
    const theme = useTheme();

    const handleMouseEnter = useCallback((id) => store.viewPrediction(id), []);
    const handleMouseLeave = useCallback(() => store.viewPrediction(-1), []);

    return (
        <Layer>
            <ArrowGroup scaleBalance={scaleBalance}
                        color={selectionColor[0]}
                        mapSize={mapSize}
                        trajectories={store.selectedPredictors.map(getPredictionTraj)}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        timeRange={[0, 150]}/>
            <ArrowGroup scaleBalance={scaleBalance}
                        color={selectionColor[1]}
                        mapSize={mapSize}
                        trajectories={store.comparedPredictors.map(getPredictionTraj)}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        timeRange={[0, 150]}/>
            <ArrowGroup scaleBalance={scaleBalance}
                        color={theme.palette.secondary.main}
                        mapSize={mapSize}
                        labelStyle={'time'}
                        listening={false}
                        trajectories={store.viewedPredictions.map(getPredictionTraj)}
                        timeRange={[0, 150]}/>
        </Layer>
    );
}

export default inject('store')(observer(PredictedTrajectoryLayer));
