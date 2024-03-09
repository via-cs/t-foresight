import {memo, useMemo} from "react";
import {alpha, Tooltip} from "@mui/material";
import {styled} from "@mui/material/styles";
import BubbleSets from "bubblesets-js";

const W = 1000, H = 1000;
const scale = 0.95;

function useConvexHull(predictorGroup, points) {
    return useMemo(() => {
        // const samplePoints = predictorGroup
        //     .map(i => [
        //         points[i][0] * W,
        //         points[i][1] * H,
        //         points[i][2] * W / 20
        //     ])
        //     .map(([x, y, r]) => {
        //         return newArr(360, deg => [
        //             x + r * Math.cos(deg / 180 * Math.PI) * 1.5,
        //             y + r * Math.sin(deg / 180 * Math.PI) * 1.5,
        //         ])
        //     })
        //     .flat()
        // const hullPoints = hull(samplePoints, 1000);
        // return 'M' + hullPoints.map(p => p.join(' ')).join('L');
        const circles = points.map(([x, y, r]) => ({
            cx: x * W,
            cy: y * H,
            radius: r * W / 20 * scale,
        }))

        const bubbles = new BubbleSets();
        bubbles.pushMember(...predictorGroup.map(i => circles[i]));
        bubbles.pushNonMember(...circles.filter((_, i) => !predictorGroup.includes(i)));
        const pointPath = bubbles.compute();
        const cleanPath = pointPath.sample(8).simplify(0).bSplines().simplify(0);
        return cleanPath.toString();
    }, [predictorGroup, points]);
}

function ConvexHull({predictorGroup, points, onViewGroup, onSelectGroup, tags, onContextMenu}) {
    const convexHull = useConvexHull(predictorGroup, points);
    return <Tooltip title={Array.from(tags).join(', ')}>
        <LassoGroup d={convexHull}
                    width={W / 200}
                    selectable
                    onMouseEnter={() => onViewGroup(predictorGroup)}
                    onMouseLeave={() => onViewGroup([])}
                    onClick={e => onSelectGroup(predictorGroup, e.shiftKey ? 1 : 0)}
                    onContextMenu={onContextMenu}/>
    </Tooltip>
}

export const LassoGroup = styled('path', {
    shouldForwardProp: propName => !['width', 'selectable', 'color'].includes(propName),
})(({theme, width, selectable, color}) => ({
    stroke: color || theme.palette.secondary.dark,
    fill: color || theme.palette.background.default,
    ...(selectable
        ? {
            strokeWidth: 0.3,
            cursor: 'pointer',
            '&:hover': {
                strokeWidth: width,
                fill: alpha(color || theme.palette.secondary.main, 0.2),
            },
        }
        : {
            strokeWidth: width,
            pointerEvents: 'none',
        }),
}))

export default memo(ConvexHull);