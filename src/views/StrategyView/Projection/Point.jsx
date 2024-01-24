import {styled, useTheme} from "@mui/material/styles";
import {selectionColor} from "../../../utils/theme.js";
import {lighten, Tooltip} from "@mui/material";
import newArr from "../../../utils/newArr.js";

const rot = vec => -Math.atan(-vec[1] / vec[0]) / Math.PI * 180 + (vec[0] < 0 ? 180 : 0)
const arrowLength = 0.4, arrowWidth = 0.4;

function Point({
                   x, y, r,
                   traj,
                   pId, tags,
                   opacity,
                   selected, compared, viewed,
                   preSelected, preSelectColor,
                   isLassoing,
                   onContextMenu,
                   onClick,
                   onMouseEnter,
                   onMouseLeave,
               }) {
    const theme = useTheme();
    const color = theme.palette.primary.main;
    const fill = lighten(color, 1 - opacity);
    const [dx, dy] = newArr(2, i => traj[traj.length - 1][i] - traj[0][i]);
    const deg = rot([dx, dy]);

    return <g transform={`translate(${x}, ${y})`}>
        <Tooltip title={Array.from(tags).join(', ')}>
            <VizPoint selected={selected}
                      compared={compared}
                      viewed={viewed}
                      isLassoing={isLassoing}
                      onContextMenu={onContextMenu}
                      onClick={onClick}
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}>
                <path d={`M0 0H1L${1 - arrowLength} ${arrowWidth}V${-arrowWidth}L1 0Z`}
                      strokeWidth={0}
                      fill={!selected && !compared && !(!isLassoing && viewed) && fill}
                      transform={`rotate(${deg}) scale(${r * 1.35},${r * 1.35})`}/>
                <circle r={r * 0.1}
                        fill={theme.palette.secondary.main}
                        cx={dx / Math.sqrt(dx * dx + dy * dy) * r}
                        cy={dy / Math.sqrt(dx * dx + dy * dy) * r}/>
                <circle r={r}
                        fill={fill}/>
            </VizPoint>
        </Tooltip>
        {isLassoing
            ? <PointAnchor preSelected={preSelected}
                           color={preSelectColor}/>
            : <PointIdx
                fill={theme.palette.getContrastText(fill)}>{pId + 1}</PointIdx>}
    </g>
}

export default Point;

const VizPoint = styled('g', {
    shouldForwardProp: propName => !['selected', 'isLassoing', 'opacity', 'viewed', 'compared'].includes(propName)
})(({theme, selected, isLassoing, viewed, compared, opacity}) => ({
    ...(isLassoing && {
        pointerEvents: 'none',
    }),
    ...(selected && {
        stroke: selectionColor[0],
        fill: selectionColor[0],
        strokeWidth: 7,
    }),
    ...(compared && {
        stroke: selectionColor[1],
        fill: selectionColor[1],
        strokeWidth: 7,
    }),
    ...(!isLassoing && viewed && {
        stroke: theme.palette.secondary.main,
        fill: theme.palette.secondary.main,
        strokeWidth: 7,
    }),
}))
const PointIdx = styled('text')({
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 34,
    pointerEvents: 'none',
})
const PointAnchor = styled('circle', {
    shouldForwardProp: propName => !['preSelected', 'color'].includes(propName)
})(({theme, preSelected, color}) => ({
    r: 7,
    fill: preSelected ? color : theme.palette.primary.main,
}))