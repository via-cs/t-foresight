import {styled} from "@mui/material/styles";
import {useRef, useState} from "react";


export default function WindowSlider({min, max, minWindow = 50, step, onChange}) {
    const range = max - min;
    const [drawingValue, setDrawingValue] = useState(null);
    const [value, setValue] = useState(null);
    const [dragOffset, setDragOffset] = useState(null);
    const containerRef = useRef(null);

    const handleClear = e => {
        e.preventDefault();
        e.stopPropagation();
        setValue(null);
        setDrawingValue(null);
        onChange([min, max]);
    }

    const ensureStep = v => Math.round(v / step) * step;

    const getCursorRatio = e => {
        const box = containerRef.current.getBoundingClientRect();
        return (e.clientX - box.x) / box.width;
    }

    const getCursorValue = e => {
        const ratio = getCursorRatio(e);
        const v = ratio * (max - min);
        const vInStep = ensureStep(v);
        return Math.max(min, Math.min(max, vInStep + min));
    }

    const getOffsetValue = offset => {
        const stepOffset = ensureStep((offset || 0) * range);
        const stepOffsetInRange = Math.min(min - value[0], Math.max(max - value[1], stepOffset))
        return [value[0] + stepOffsetInRange, value[1] + stepOffsetInRange];
    }

    const handleMouseDown = e => {
        if (e.button !== 0) return;
        if (drawingValue) return;
        const v = getCursorValue(e);
        setDrawingValue([v, v + ensureStep(minWindow)]);
        onChange(drawingValue);
        setValue(null);
    }

    const handleMouseMove = e => {
        if (drawingValue) {
            const v = getCursorValue(e);
            setDrawingValue([drawingValue[0], Math.max(v, drawingValue[0] + ensureStep(minWindow))]);
            onChange(drawingValue);
        } else if (dragOffset) {
            const v = getCursorRatio(e);
            const offset = v - dragOffset;
            setDragOffset([dragOffset[0], offset]);
            onChange(getOffsetValue(offset));
        }
    }

    const handleMouseUp = e => {
        if (!drawingValue) return;
        setValue(drawingValue);
        setDrawingValue(null);
        onChange(value);
    }

    const handleDragStart = e => {
        e.stopPropagation();
        if (dragOffset) return;
        const ratio = getCursorRatio(e);
        setDragOffset([ratio, 0]);
    }

    const handleDragEnd = e => {
        e.stopPropagation();
        if (!dragOffset) return;
        setDragOffset(null);
        onChange(value);
    }

    return <Container ref={containerRef}
                      onContextMenu={handleClear}
                      onMouseDown={handleMouseDown}
                      onMouseUp={handleMouseUp}
                      onMouseMove={handleMouseMove}>
        {drawingValue && <DrawingArea style={{
            left: `${(drawingValue[0] - min) / range * 100}%`,
            width: `${(drawingValue[1] - drawingValue[0]) / range * 100}%`
        }}/>}
        {value && <WindowArea onMouseDown={handleDragStart}
                              onMouseUp={handleDragEnd}
                              style={{
                                  left: `${(getOffsetValue(dragOffset[1])[0] - min) / range * 100}%`,
                                  width: `${(value[1] - value[0]) / range * 100}%`
                              }}/>}
        <Divider style={{left: `${Math.abs(min) / (Math.abs(min) + Math.abs(max)) * 100}%`}}/>
    </Container>
}

const Container = styled('div')(({theme}) => ({
    position: 'relative',
    width: '100%',
    height: 40,
    background: theme.palette.background.default,
    cursor: 'crosshair',
}))

const Divider = styled('hr')(({theme}) => ({
    position: 'absolute',
    top: 0,
    margin: 0,
    height: '100%',
    width: 1,
    backgroundColor: 'white',
    mixBlendMode: 'revert',
    pointerEvents: 'none',
}))

const Area = styled('div')(({theme}) => ({
    position: 'absolute',
    height: '100%',
    background: theme.palette.primary.main,
}))

const DrawingArea = styled(Area)({
    pointerEvents: 'none'
})

const WindowArea = styled(Area)({
    cursor: 'pointer',
})
