import MapSliceRenderer from "./MapSliceRenderer.jsx";
import {Arrow, Group} from "react-konva";
import {mapDis, mapProject} from "../../../utils/game.js";

/**
 * @param {import('src/model/Strategy.js').Strategy} strat
 * @param {import('src/model/Strategy.js').Prediction} pred
 * @return {JSX.Element}
 * @constructor
 */
function PredictionMapRenderer({strat, pred}) {
    const centerPos = pred.trajectory[0];
    const radius = Math.max(...strat.predictors.map(p => Math.max(...p.trajectory.map(pos => mapDis(pos, centerPos)))))
    return <MapSliceRenderer centerPos={centerPos} radius={radius}>
        {(mapSize, scale) => {
            const traj = pred.trajectory.map(p => mapProject(p, mapSize));
            return <Group>
                <Arrow points={traj.flat()}
                       stroke={'red'} strokeWidth={3 / scale}
                       fill={'red'}
                       pointerWidth={10 / scale} pointerLength={10 / scale}/>
            </Group>
        }}
    </MapSliceRenderer>
}

export default PredictionMapRenderer;