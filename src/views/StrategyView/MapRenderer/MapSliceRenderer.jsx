import {Layer, Stage} from "react-konva";
import {styled} from "@mui/material/styles";
import {useRef} from "react";
import useSize from "../../../utils/useSize.js";
import KonvaImage from "../../../components/KonvaImage.jsx";
import useFocusMapArea from "./useFocusMapArea.js";

/**
 *
 * @param {[number, number]} centerPos
 * @param {number} radius
 * @param {Function} children
 * @return {JSX.Element}
 * @constructor
 */
function MapSliceRenderer({centerPos, radius, children}) {
    const containerRef = useRef(null);
    const {width, height} = useSize(containerRef);
    const size = Math.min(width, height);
    const {scale, offset} = useFocusMapArea(centerPos, radius, size);

    return <Container ref={containerRef}>
        <Stage width={size} height={size}
               scaleX={scale} scaleY={scale}
               x={offset[0]} y={offset[1]}>
            <Layer>
                <KonvaImage src={'./map.jpeg'} w={size} h={size}/>
            </Layer>
            <Layer>
                {children && children(size, scale)}
            </Layer>
        </Stage>
    </Container>
}

const Container = styled('div')({
    width: '100%',
    height: '100%',
})

export default MapSliceRenderer;