import {Arrow, Group, Line, Rect} from "react-konva";
import {alpha} from "@mui/material";
import newArr from "../../../utils/newArr.js";
import {useTheme} from "@mui/material/styles";
import {useCallback} from "react";
import {selectionColor} from "../../../utils/theme.js";
import {probOpacity} from "../../../utils/encoding.js";

const rot = vec => Math.atan(-vec[1] / vec[0]) / Math.PI * 180 - (vec[0] < 0 ? 180 : 0)

/**
 *
 * @param {number} numGrid
 * @param {number} timeStep
 * @param {number} x
 * @param {number} y
 * @param {'left' | 'right' | 'top' | 'bottom'} direction
 * @param {number} gridSize
 * @param {number} space
 * @param {[number, [number, number], Set<number>][][]} data
 * @param {number} arrowSize
 * @param {number} amp
 * @param {number} curPos
 * @param {[number, number]} range
 * @param {number[]} viewedPredictions
 * @param {(g: number, t: number, data: [number, [number, number], Set<number>]) => void} onEnter
 * @param {(g: number, t: number, data: [number, [number, number], Set<number>]) => void} onLeave
 * @param {(g: number, t: number, data: [number, [number, number], Set<number>]) => void} onClick
 * @return {JSX.Element}
 * @constructor
 */
function MapContextMatrix({
                              numGrid,
                              timeStep,
                              x, y,
                              direction,
                              gridSize,
                              space,
                              data,
                              arrowSize,
                              amp,
                              curPos,
                              range,
                              viewedPredictions,
                              onEnter,
                              onLeave,
                              onClick,
                          }) {
    const gridArr = newArr(numGrid, g => newArr(timeStep, t => [g, t])).flat();
    const disStep = gridSize + space, mapSize = numGrid * disStep - space;
    const theme = useTheme();
    const pos = useCallback(step => step * disStep + gridSize / 2, [disStep, gridSize]);
    const gridPos = useCallback((g, t) => {
        if (direction === 'top') return [pos(g), pos(timeStep - t - 1)];
        else if (direction === 'left') return [pos(timeStep - t - 1), pos(numGrid - g - 1)];
        else if (direction === 'right') return [pos(t), pos(numGrid - g - 1)];
        else return [pos(g), pos(t)];
    }, [direction, pos]);

    return <Group x={x} y={y}>
        {gridArr.map(([g, t]) => {
            const [x, y] = gridPos(g, t);
            return <Group key={`${g},${t}`}
                          x={x}
                          y={y}
                          onMouseEnter={() => onEnter(g, t, data[g][t])}
                          onMouseLeave={() => onLeave(g, t, data[g][t])}
                          onClick={() => onClick(g, t, data[g][t])}>
                <Rect x={-gridSize / 2} width={gridSize}
                      y={-gridSize / 2} height={gridSize}
                      stroke={theme.palette.background.default} strokeWidth={2}
                      fill={alpha(selectionColor[0] || '#fff', probOpacity(data[g][t][0]))}/>
                {(viewedPredictions.length === 0 || viewedPredictions[0] === -1 || viewedPredictions.some(p => data[g][t][2].has(p))) &&
                    <Arrow stroke={'#fff'} fill={'#fff'} strokeWidth={1}
                           pointerWidth={0.4 * gridSize * arrowSize}
                           pointerLength={0.4 * gridSize * arrowSize}
                           points={[-gridSize / 2 * arrowSize, 0, gridSize / 2 * arrowSize, 0]}
                           rotation={data[g][t][0] === 0 ? 0 : rot(data[g][t][1])}/>}
            </Group>
        })}
        {curPos > range[0] && curPos < range[1] &&
            <Line stroke={selectionColor[0]} strokeWidth={2}
                  points={[].includes(direction)
                      ? [
                          mapSize * (curPos - range[0]) / (range[1] - range[0]), 0,
                          mapSize * (curPos - range[0]) / (range[1] - range[0]), timeStep * disStep,
                      ] : [
                          0, mapSize * (range[1] - curPos) / (range[1] - range[0]),
                          timeStep * disStep, mapSize * (range[1] - curPos) / (range[1] - range[0]),
                      ]}/>}
    </Group>
}

export default MapContextMatrix