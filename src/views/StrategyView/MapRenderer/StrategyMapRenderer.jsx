import MapSliceRenderer from "./MapSliceRenderer.jsx";
import {mapDis, mapProject} from "../../../utils/game.js";
import {inject, observer} from "mobx-react";
import KonvaImage from "../../../components/KonvaImage.jsx";
import useHeatmap from "./useHeatmap.js";

/**
 *
 * @param {import('src/store/store.js').Store} store
 * @param {number} sId
 * @return {JSX.Element}
 * @constructor
 */
function StrategyMapRenderer({sId, store, strat}) {
    if (strat === null) strat = store.strategies[sId];
    const centerPos = strat.predictors[0].trajectory[0];
    const radius = Math.max(...strat.predictors.map(p =>
        Math.max(...p.trajectory.map(pos =>
            mapDis(pos, centerPos)
        ))
    ))
    const heatmap = useHeatmap(500, strat.predictors.map(p => {
        const pos = mapProject(p.trajectory[p.trajectory.length - 1], 500);
        return {
            x: pos[0],
            y: pos[1],
            value: Math.floor(p.probability * 200),
        }
    }), {
        radius: 20,
        blur: 20,
    });

    return <MapSliceRenderer centerPos={centerPos} radius={radius + 100}>
        {(mapSize, scale) => <KonvaImage x={0} y={0} w={mapSize} h={mapSize}
                                         src={heatmap}/>}
    </MapSliceRenderer>
}

export default inject('store')(observer(StrategyMapRenderer));