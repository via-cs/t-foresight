import {styled, useTheme} from "@mui/material/styles";
import {selectionColor} from "../../../utils/theme.js";
import {lighten, Tooltip} from "@mui/material";

function Point({
                   x, y, r,
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
    // const color = (!isLassoing && viewed) ? theme.palette.secondary.main
    //     : compared ? selectionColor[1]
    //         : selected ? selectionColor[0]
    //             : theme.palette.primary.main;
    const color = theme.palette.primary.main;
    const fill = lighten(color, 1 - opacity);
    // const fill = alpha(color, opacity);

    return <g transform={`translate(${x}, ${y})`}>
        <Tooltip title={Array.from(tags).join(', ')}>
            <CorePoint fill={fill}
                       r={r}
                       selected={selected}
                       compared={compared}
                       viewed={viewed}
                       isLassoing={isLassoing}
                       onContextMenu={onContextMenu}
                       onClick={onClick}
                       onMouseEnter={onMouseEnter}
                       onMouseLeave={onMouseLeave}/>
        </Tooltip>
        {isLassoing
            ? <PointAnchor preSelected={preSelected}
                           color={preSelectColor}/>
            : <PointIdx
                fill={theme.palette.getContrastText(fill)}>{pId + 1}</PointIdx>}
    </g>
}

export default Point;

const CorePoint = styled('circle', {
    shouldForwardProp: propName => !['selected', 'isLassoing', 'opacity', 'viewed', 'compared'].includes(propName)
})(({theme, selected, isLassoing, viewed, compared, opacity}) => ({
    ...(isLassoing && {
        pointerEvents: 'none',
    }),
    ...(selected && {
        stroke: selectionColor[0],
        strokeWidth: 7,
    }),
    ...(compared && {
        stroke: selectionColor[1],
        strokeWidth: 7,
    }),
    ...(!isLassoing && viewed && {
        stroke: theme.palette.secondary.main,
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