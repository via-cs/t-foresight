import {Layer, Stage} from "react-konva";
import useProjection from "./useProjection.js";
import usePointLassoSelection from "./usePointLassoSelection.js";
import useLasso from "./useLasso.js";
import {styled, useTheme} from "@mui/material/styles";
import {alpha, lighten} from "@mui/material";
import {useCallback} from "react";

const W = 1000, H = 1000;

/**
 *
 * @param {{sId: number, pId: number, pred: import('src/model/Strategy.js').Prediction}[]} allPredictors
 * @param {[number, number][]} selectedPredictors
 * @param {(predIds: [number, number][]) => void} onSelect
 * @constructor
 */
function PredictorsProjection({allPredictors, selectedPredictors, onSelect}) {
    const selectedPredictorsIdx = selectedPredictors.map(([s, p]) => `${s},${p}`);
    const points = useProjection(allPredictors);
    const {lasso, isDrawing, handleMouseDown, handleMouseUp, handleMouseMove} = useLasso();
    const preSelectedPointsIdx = usePointLassoSelection(points, lasso);
    const handleClear = useCallback(e => {
        e.preventDefault();
        e.stopPropagation();
        onSelect([]);
    }, []);

    const theme = useTheme();
    return <svg viewBox={`0 0 ${W} ${H}`} width={'100%'} height={'100%'}
                onContextMenu={handleClear}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={e => {
                    onSelect(preSelectedPointsIdx.map(i => [allPredictors[i].sId, allPredictors[i].pId]));
                    handleMouseUp(e);
                }}>
        <g>
            {allPredictors.map((p, pId) => {
                const opacity = Math.min(p.pred.probability * 5, 1);
                return <g key={pId}
                          transform={`translate(${points[pId][0] * W}, ${points[pId][1] * H})`}>
                    <Point fillOpacity={opacity}
                           selected={selectedPredictorsIdx.includes(`${p.sId},${p.pId}`)}/>
                    {isDrawing
                        ? <PointAnchor preSelected={preSelectedPointsIdx.includes(pId)}/>
                        : <PointIdx fill={theme.palette.getContrastText(lighten(theme.palette.primary.main, 1 - opacity))}>{pId + 1}</PointIdx>}
                </g>
            })}
        </g>
        {isDrawing && <Lasso d={'M' + lasso.map(p => `${p[0] * W} ${p[1] * H}`).join('L')}/>}
    </svg>
}

export default PredictorsProjection;
const Point = styled('circle', {
    shouldForwardProp: propName => !['selected'].includes(propName)
})(({theme, selected}) => ({
    fill: theme.palette.primary.main,
    r: W / 20,
    ...(selected && {
        stroke: theme.palette.success.main,
        strokeWidth: W / 200,
    })
}))
const PointIdx = styled('text')({
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: W / 20,
})
const PointAnchor = styled('circle', {
    shouldForwardProp: propName => !['preSelected'].includes(propName)
})(({theme, preSelected}) => ({
    r: W / 100,
    fill: preSelected ? theme.palette.success.main : theme.palette.primary.main,
}))
const Lasso = styled('path')(({theme}) => ({
    stroke: theme.palette.primary.main,
    strokeWidth: W / 100,
    fill: alpha(theme.palette.success.main, 0.1),
    pointerEvents: 'none',
}))