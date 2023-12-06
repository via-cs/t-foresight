import {Rect} from "react-konva";
import {Fragment} from "react";
import {useTheme} from "@mui/material/styles";

export default function Cell({gridSize, viewed, data}) {
    const theme = useTheme();
    return <Fragment>
        <Rect width={gridSize} height={gridSize}
              fill={theme.palette.background.default}
              stroke={theme.palette.secondary.main}
              strokeWidth={Number(viewed)}/>
        <Rect x={gridSize * (1 - data) / 2} width={gridSize * data}
              y={gridSize * (1 - data) / 2} height={gridSize * data}
              fill={theme.palette.text.primary}/>
    </Fragment>
}