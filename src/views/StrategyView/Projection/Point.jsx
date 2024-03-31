import {styled, useTheme} from "@mui/material/styles";
import {selectionColor} from "../../../utils/theme.js";
import {alpha, Tooltip} from "@mui/material";
import newArr from "../../../utils/newArr.js";
import {rot} from "../../../utils/rot.js";
import useKeyPressed from "../../../utils/useKeyPressed.js";

const arrowLength = 1.45;
const arrowWidth = 0.4;
const arrowR = Math.asin(arrowWidth);
const [x, y] = [Math.cos(arrowR), Math.sin(arrowR)];
const arrowPath = `M${arrowLength} 0L${x} ${y}A1 1 0 0 0 ${x} ${-y}Z`;

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
    const fill = alpha(color, opacity);
    const [dx, dy] = newArr(2, i => traj[traj.length - 1][i] - traj[0][i]);
    const deg = rot([dx, dy]);
    const shift = useKeyPressed('Shift');

    return <g transform={`translate(${x}, ${y})`}>
        <Tooltip title={Array.from(tags).join(', ')}>
            <VizPoint selected={selected}
                      compared={compared}
                      viewed={viewed}
                      shift={shift}
                      isLassoing={isLassoing}
                      onContextMenu={onContextMenu}
                      onClick={onClick}
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}>
                <path d={arrowPath}
                      strokeWidth={0}
                    // fill={!selected && !compared && !(!isLassoing && viewed) ? fill : undefined}
                      transform={`rotate(${deg}) scale(${r},${r})`}/>
                <circle r={r}
                        fill={fill}/>
                {/*<circle r={r * 0.1}*/}
                {/*        fill={theme.palette.secondary.main}*/}
                {/*        cx={r} cy={0}*/}
                {/*        transform={`rotate(${deg})`}/>*/}
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
    shouldForwardProp: propName => !['selected', 'isLassoing', 'opacity', 'viewed', 'compared', 'shift'].includes(propName)
})(({theme, selected, isLassoing, viewed, compared, opacity, shift}) => ({
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
        stroke: selectionColor[Number(shift)],
        fill: selectionColor[Number(shift)],
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