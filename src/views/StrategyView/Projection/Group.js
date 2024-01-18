import {styled} from "@mui/material/styles";
import {alpha} from "@mui/material";

const LassoGroup = styled('path', {
    shouldForwardProp: propName => !['width', 'selectable', 'selected', 'color'].includes(propName),
})(({theme, width, selectable, selected, color}) => ({
    stroke: color || theme.palette.secondary.dark,
    fill: alpha(color || theme.palette.secondary.main, 0.1),
    ...(selectable
        ? {
            strokeWidth: 0,
            cursor: 'pointer',
            '&:hover': {
                strokeWidth: width,
                fill: alpha(color || theme.palette.secondary.main, 0.2),
            },
            ...(selected && {
                strokeWidth: width,
            })
        }
        : {
            strokeWidth: width,
            pointerEvents: 'none',
        }),
}))

export default LassoGroup;