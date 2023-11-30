import {styled} from "@mui/material/styles";
import {alpha} from "@mui/material";

const LassoGroup = styled('path', {
    shouldForwardProp: propName => !['width', 'selectable', 'selected'].includes(propName),
})(({theme, width, selectable, selected}) => ({
    stroke: theme.palette.success.dark,
    fill: alpha(theme.palette.success.main, 0.1),
    ...(selectable
        ? {
            strokeWidth: 0,
            cursor: 'pointer',
            '&:hover': {
                strokeWidth: width,
                fill: alpha(theme.palette.success.main, 0.2),
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