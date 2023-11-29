import MapSliceRenderer from "./MapSliceRenderer.jsx";
import {Arrow, Circle, Group} from "react-konva";
import {mapDis, mapProject} from "../../../utils/game.js";
import {inject, observer} from "mobx-react";

/**
 *
 * @param {import('src/store/store.js').Store} store
 * @param {number} sId
 * @param {number} pId
 * @param {import('src/model/Strategy.js').Strategy} strat
 * @param {import('src/model/Strategy.js').Prediction} pred
 * @return {JSX.Element}
 * @constructor
 */
function PredictionMapRenderer({store, sId, pId, strat, pred}) {
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

export default inject('store')(observer(PredictionMapRenderer));