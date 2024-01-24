import {Fragment} from "react";
import {Arrow, Circle, Group} from "react-konva";
import {selectionColor} from "../../../utils/theme.js";
import {useTheme} from "@mui/material/styles";
import {rot} from "../../../utils/rot.js";
import {alpha} from "@mui/material";
import {probOpacity} from "../../../utils/encoding.js";

const arcRadiusFactory = r => [
    [r - 1, r],
    [r - 3, r - 2],
    [r - 5, r - 4],
];
const calAngle = dirRange => {
    if (dirRange.length === 1) return [dirRange[0] - 5, 10];
    dirRange.sort((a, b) => a - b);
    let largestGap = dirRange[0] + 360 - dirRange[dirRange.length - 1], gapIdx = 0;
    for (let i = 1; i < dirRange.length; i++)
        if (dirRange[i] - dirRange[i - 1] > largestGap) {
            largestGap = dirRange[i] - dirRange[i - 1];
            gapIdx = i;
        }
    if (gapIdx === 0) return [dirRange[0], dirRange[dirRange.length - 1] - dirRange[gapIdx]]
    else return [dirRange[gapIdx], dirRange[gapIdx - 1] + 360 - dirRange[gapIdx]];
}

/**
 * @param {number} gridSize
 * @param {import('src/model/System.js').MatrixCell} sel
 * @param {boolean} selEnabled
 * @param {import('src/model/System.js').MatrixCell} comp
 * @param {boolean} compEnabled
 * @param {import('src/model/System.js').MatrixCell} view
 * @param {boolean} viewEnabled
 * @return {JSX.Element}
 * @constructor
 */
function MatrixCell({
                        gridSize,
                        sel, selEnabled,
                        comp, compEnabled,
                        view, viewEnabled
                    }) {
    const theme = useTheme();
    const arcRadius = arcRadiusFactory(gridSize / 2);
    const layers = [];
    if (selEnabled) layers.push('sel');
    if (compEnabled) layers.push('comp');
    if (viewEnabled) layers.push('view');
    const options = {
        sel: {
            data: sel,
            color: alpha(selectionColor[0], probOpacity(sel.probability)),
        },
        comp: {
            data: comp,
            color: alpha(selectionColor[1], probOpacity(comp.probability)),
        },
        view: {
            data: view,
            color: alpha(theme.palette.secondary.main, probOpacity(view.probability)),
        }
    };
    const arrowSize = layers.length ? arcRadius[layers.length - 1][0] * 0.9 : 0;

    return <Fragment>
        <Circle radius={gridSize / 2}
                stroke={theme.palette.background.default} strokeWidth={2}
                fill={alpha('#fff', 0.9)}/>
        {layers.map((layer, lId) => {
            const {data, color} = options[layer];
            if (data.probability === 0) return null;

            const [start, angle] = calAngle(data.dirRange);
            return <Group key={lId}>
                {/*<Arc angle={angle}*/}
                {/*     rotation={start}*/}
                {/*     innerRadius={arcRadius[lId][0]} outerRadius={arcRadius[lId][1]}*/}
                {/*     fill={color}/>*/}
                {(!viewEnabled || layer === 'view') &&
                    <Arrow stroke={color} fill={color} strokeWidth={1}
                           pointerWidth={0.5 * arrowSize}
                           pointerLength={0.5 * arrowSize}
                           points={[-arrowSize * 0.2, 0, arrowSize, 0]}
                           rotation={data.probability === 0 ? 0 : rot(data.avgDirection)}/>}
            </Group>
        })}
    </Fragment>
}

export default MatrixCell;