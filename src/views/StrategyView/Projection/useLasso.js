import {useCallback, useState} from "react";

export default function useLasso() {
    const [lasso, setLasso] = useState([]);
    const [drawingState, setDrawingState] = useState('off');
    const getCursorPos = useCallback(e => {
        const {left, top, width, height} = e.currentTarget.getBoundingClientRect();
        const {clientX, clientY} = e;
        return [(clientX - left) / width, (clientY - top) / height];
    }, []);
    const handleMouseDown = useCallback(e => {
        if (drawingState !== 'off') return;
        if (e.button !== 0) return;
        setDrawingState('ready');
        const cursor = getCursorPos(e);
        setLasso([cursor]);
    }, [drawingState]);
    const handleMouseMove = useCallback(e => {
        if (drawingState === 'off') return;
        if (drawingState === 'ready') setDrawingState('drawing');
        const cursor = getCursorPos(e);
        setLasso(l => [...l, cursor]);
    }, [drawingState]);
    const handleMouseUp = useCallback(() => {
        if (drawingState === 'off') return;
        setDrawingState('off');
        setLasso([]);
    }, [drawingState]);
    return {
        lasso,
        isDrawing: drawingState === 'drawing',
        handleMouseMove,
        handleMouseDown,
        handleMouseUp,
    }
}