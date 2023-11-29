import {Layer, Stage} from "react-konva";
import useProjection from "./useProjection.js";
import usePointLassoSelection from "./usePointLassoSelection.js";
import useLasso from "./useLasso.js";
import {styled, useTheme} from "@mui/material/styles";
import {alpha, lighten} from "@mui/material";
import {memo, useCallback} from "react";
import createConvexHull from "./createConvexHull.js";

const W = 1000, H = 1000;

const Groups = memo(function ({predictorGroups, points, onSelectGroup}) {
    return <g>
        {predictorGroups.map((g, gId) => (
            <Group key={gId}
                   d={createConvexHull(g.map(i => [
                       points[i][0] * W,
                       points[i][1] * H,
                       points[i][2] * W / 20
                   ]))}
                   onClick={() => onSelectGroup(g)}/>
        ))}
    </g>
})

/**
 *
 * @param {import('src/model/Strategy.js').Prediction[]} allPredictors
 * @param {number[][]} predictorGroups
 * @param {number[]} selectedPredictors
 * @param {(predIds: number[]) => void} onSelectGroup
 * @constructor
 */
function PredictorsProjection({allPredictors, predictorGroups, selectedPredictors, onSelectGroup, onViewPredictor}) {
    const points = useProjection(allPredictors, predictorGroups);
    const {lasso, isDrawing, handleMouseDown, handleMouseUp, handleMouseMove} = useLasso();
    const preSelectedPointsIdx = usePointLassoSelection(points, lasso);
    const handleClear = useCallback(e => {
        e.preventDefault();
        e.stopPropagation();
        onSelectGroup([]);
    }, []);

    const theme = useTheme();
    return <svg viewBox={`0 0 ${W} ${H}`} width={'100%'} height={'100%'}
                onContextMenu={handleClear}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={e => {
                    onSelectGroup(preSelectedPointsIdx);
                    handleMouseUp(e);
                }}>
        <Groups predictorGroups={predictorGroups} points={points}
                onSelectGroup={onSelectGroup}/>
        <g>
            {allPredictors.map((p, pId) => {
                const opacity = Math.min(p.probability * 5, 1);
                return <g key={pId}
                          transform={`translate(${points[pId][0] * W}, ${points[pId][1] * H})`}>
                    <Point fillOpacity={opacity}
                           selected={selectedPredictors.includes(pId)}
                           isDrawing={isDrawing}
                           r={points[pId][2] * W / 20}
                           onMouseEnter={() => onViewPredictor(pId)}
                           onMouseLeave={() => onViewPredictor(-1)}/>
                    {isDrawing
                        ? <PointAnchor preSelected={preSelectedPointsIdx.includes(pId)}/>
                        : <PointIdx
                            fill={theme.palette.getContrastText(lighten(theme.palette.primary.main, 1 - opacity))}>{pId + 1}</PointIdx>}
                </g>
            })}
        </g>
        {isDrawing && <Lasso d={'M' + lasso.map(p => `${p[0] * W} ${p[1] * H}`).join('L')}/>}
    </svg>
}

export default PredictorsProjection;
const Point = styled('circle', {
    shouldForwardProp: propName => !['selected', 'isDrawing'].includes(propName)
})(({theme, selected, isDrawing}) => ({
    fill: theme.palette.primary.main,
    ...(isDrawing && {
        pointerEvents: 'none',
    }),
    ...(!isDrawing && {
        '&:hover': {
            stroke: theme.palette.secondary.main,
            strokeWidth: W / 200,
        }
    }),
    ...(selected && {
        stroke: theme.palette.success.main,
        strokeWidth: W / 200,
    })
}))
const PointIdx = styled('text')({
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: W / 20,
    pointerEvents: 'none',
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
const Group = styled('path')(({theme}) => ({
    fill: alpha(theme.palette.success.main, 0.1),
    cursor: 'pointer',
    '&:hover': {
        stroke: theme.palette.primary.main,
        strokeWidth: W / 100,
        fill: alpha(theme.palette.success.main, 0.2),
    }
}))