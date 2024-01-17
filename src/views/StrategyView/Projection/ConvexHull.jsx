import {memo, useMemo} from "react";
import hull from "hull.js";
import LassoGroup from "./Group.js";
import {Tooltip} from "@mui/material";
import newArr from "../../../utils/newArr.js";

const W = 1000, H = 1000;

function sameArray(a1, a2) {
    return a1.length === a2.length && a1.every(v => a2.includes(v));
}

function useConvexHull(predictorGroup, points) {
    return useMemo(() => {
        const samplePoints = predictorGroup
            .map(i => [
                points[i][0] * W,
                points[i][1] * H,
                points[i][2] * W / 20
            ])
            .map(([x, y, r]) => {
                return newArr(360, deg => [
                    x + r * Math.cos(deg / 180 * Math.PI) * 1.5,
                    y + r * Math.sin(deg / 180 * Math.PI) * 1.5,
                ])
            })
            .flat()
        const hullPoints = hull(samplePoints, 1000);
        return 'M' + hullPoints.map(p => p.join(' ')).join('L');
    }, [predictorGroup, points]);
}

function ConvexHull({predictorGroup, points, selected, onSelectGroup, tags, onContextMenu}) {
    const convexHull = useConvexHull(predictorGroup, points);
    return <Tooltip title={Array.from(tags).join(', ')}>
        <LassoGroup d={convexHull}
                    width={W / 200}
                    selectable
                    selected={sameArray(selected, predictorGroup)}
                    onClick={e => onSelectGroup(predictorGroup, e.button === 0 ? 0 : 1)}
                    onContextMenu={onContextMenu}/>
    </Tooltip>
}

export default memo(ConvexHull);