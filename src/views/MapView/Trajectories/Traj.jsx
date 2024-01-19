import {memo} from "react";
import {Arrow, Circle, Group, Rect, Text} from "react-konva";
import {mapProject} from "../../../utils/game.js";
import newArr from "../../../utils/newArr.js";
import {useTheme} from "@mui/material/styles";

const timeLabelLayoutFactory = scaleBalance => ({
    x: -8 * scaleBalance,
    y: -6 * scaleBalance,
    width: 16 * scaleBalance,
    height: 12 * scaleBalance,
    cornerRadius: 6 * scaleBalance,
    fontSize: 8 * scaleBalance,
})

const pos = (p, r, l) => Math.floor((p - r[0]) / (r[1] - r[0]) * (l - 1));

export default memo(function Traj({
                                      traj,
                                      mapSize,
                                      scaleBalance,
                                      color,
                                      timeRange,
                                      labelStyle = 'dot',
                                      noPointer = false,
                                      noDash = false,
                                      opacity = 1
                                  }) {
    const t0 = Math.ceil(timeRange[0] / 30), t1 = Math.floor(timeRange[1] / 30);
    const tAnno = newArr(t1 - t0 + 1, i => ({
        label: i + t0,
        pos: mapProject(traj[pos((i + t0) * 30, timeRange, traj.length)], mapSize),
    }));
    if (!noPointer && t1 * 30 === timeRange[1]) tAnno.pop();
    const theme = useTheme();
    const timeLabelLayout = timeLabelLayoutFactory(scaleBalance);

    return <Group opacity={opacity}>
        <Arrow points={traj.map(p => mapProject(p, mapSize)).flat()}
               strokeWidth={1.2 * scaleBalance} // Line width
               pointerWidth={noPointer ? 0 : 4 * scaleBalance}
               pointerLength={noPointer ? 0 : 4 * scaleBalance}
               dash={noDash ? [] : [6 * scaleBalance, 2 * scaleBalance]}
               stroke={color} fill={color}/>
        {tAnno.map(({label, pos}) => labelStyle === 'dot'
            ? <Circle x={pos[0]} y={pos[1]} fill={color} radius={3 * scaleBalance}/>
            : <Group x={pos[0]} y={pos[1]}>
                <Rect fill={color}
                      {...timeLabelLayout}/>
                <Text text={`${label}s`}
                      fill={theme.palette.getContrastText(color)}
                      align={'center'} verticalAlign={'middle'}
                      {...timeLabelLayout}/>
            </Group>)}
    </Group>
})