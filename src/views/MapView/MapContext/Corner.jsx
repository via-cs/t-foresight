import {Group, Line, Rect, Text} from "react-konva";
import newArr from "../../../utils/newArr.js";
import {useTheme} from "@mui/material/styles";

export default function MapContextCorner({timeStep, x, y, direction, gridSize, space, textSize = [16, 10], onClick}) {
    const disStep = gridSize + space;
    const pos = (step) => step * disStep + gridSize / 2 + space;
    const xDir = direction.endsWith('l') ? -1 : 1, yDir = direction.startsWith('t') ? -1 : 1;
    const theme = useTheme();

    return <Group x={x} y={y} onClick={onClick}>
        {newArr(timeStep, i => (
            <Group key={i}>
                <Line stroke={theme.palette.background.default} strokeWidth={2}
                      points={[
                          pos(i) * xDir, 0,
                          pos(i) * xDir, pos(i) * yDir,
                          0, pos(i) * yDir,
                      ]}/>
                <Rect x={pos(i) * xDir - textSize[0] / 2} width={textSize[0]}
                      y={pos(i) * yDir - textSize[1] / 2} height={textSize[1]}
                      fill={'#fff'}/>
                <Text x={pos(i) * xDir - textSize[0] / 2} width={textSize[0]}
                      y={pos(i) * yDir - textSize[1] / 2} height={textSize[1]}
                      align={'center'} verticalAlign={'middle'}
                      text={`${i + 1}s`}/>
            </Group>
        ))}
    </Group>
}