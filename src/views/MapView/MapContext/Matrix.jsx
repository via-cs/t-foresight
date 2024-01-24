import {Group, Line} from "react-konva";
import newArr from "../../../utils/newArr.js";
import {useTheme} from "@mui/material/styles";
import {useCallback} from "react";
import MatrixCell from "./MatrixCell.jsx";

/**
 *
 * @param {number} numGrid
 * @param {number} timeStep
 * @param {number} x
 * @param {number} y
 * @param {'left' | 'right' | 'top' | 'bottom'} direction
 * @param {number} gridSize
 * @param {number} space
 * @param {import('src/model/System.js').MatrixCell[][]} data
 * @param {import('src/model/System.js').MatrixCell[][]} compData
 * @param {import('src/model/System.js').MatrixCell[][]} viewData
 * @param {number} curPos
 * @param {[number, number]} range
 * @param {number[]} selectedPredictions
 * @param {number[]} comparedPredictions
 * @param {number[]} viewedPredictions
 * @param {(g: number, t: number) => void} onEnter
 * @param {(g: number, t: number) => void} onLeave
 * @param {(g: number, t: number) => void} onClick
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
                              data, compData, viewData,
                              curPos,
                              range,
                              selectedPredictions,
                              comparedPredictions,
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
        {curPos > range[0] && curPos < range[1] &&
            <Line stroke={theme.palette.secondary.main} strokeWidth={2}
                  points={['top', 'bottom'].includes(direction)
                      ? [
                          mapSize * (curPos - range[0]) / (range[1] - range[0]), 0,
                          mapSize * (curPos - range[0]) / (range[1] - range[0]), timeStep * disStep,
                      ] : [
                          0, mapSize * (range[1] - curPos) / (range[1] - range[0]),
                          timeStep * disStep, mapSize * (range[1] - curPos) / (range[1] - range[0]),
                      ]}/>}
        {gridArr.map(([g, t]) => {
            const [x, y] = gridPos(g, t);
            return <Group key={`${g},${t}`}
                          x={x}
                          y={y}
                          onMouseEnter={() => onEnter(g, t)}
                          onMouseLeave={() => onLeave(g, t)}
                          onClick={() => onClick(g, t)}>
                <MatrixCell gridSize={gridSize}
                            sel={data[g][t]} selEnabled={selectedPredictions.length !== 0}
                            comp={compData[g][t]} compEnabled={comparedPredictions.length !== 0}
                            view={viewData[g][t]} viewEnabled={viewedPredictions.length !== 0}/>
            </Group>
        })}
    </Group>
}

export default MapContextMatrix