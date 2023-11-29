import {inject, observer} from "mobx-react";
import KonvaImage from "../../components/KonvaImage.jsx";
import {mapDis, mapProject} from "../../utils/game.js";
import useHeatmap from "../StrategyView/MapRenderer/useHeatmap.js";
import {useEffect} from "react";
import {Layer} from "react-konva";

function StrategyRenderer({mapSize, strat, onAutoFocus, resolution = 500}) {
    useEffect(() => {
        const centerPos = strat.predictors[0].trajectory[0];
        const radius = Math.max(...strat.predictors.map(p =>
            Math.max(...p.trajectory.map(pos =>
                mapDis(pos, centerPos)
            ))
        )) * 1.5;
        onAutoFocus && onAutoFocus(centerPos, radius);
    }, []);

    const heatmap = useHeatmap(resolution, strat.predictors.map(p => {
        const pos = mapProject(p.trajectory[p.trajectory.length - 1], resolution);
        return {
            x: pos[0],
            y: pos[1],
            value: Math.floor(p.probability * 200),
        }
    }), {
        radius: resolution / 25,
        blur: resolution / 25,
    });
    return <Layer>
        <KonvaImage x={0} y={0} w={mapSize} h={mapSize}
                    src={heatmap}/>
    </Layer>
}

export default inject()(observer(StrategyRenderer))