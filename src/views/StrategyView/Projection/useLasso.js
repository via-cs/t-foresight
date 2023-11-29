import {useCallback, useState} from "react";

export default function useLasso() {
    const [lasso, setLasso] = useState([]);
    const [isDrawing, setDrawing] = useState(false);
    const getCursorPos = useCallback(e => {
        const {left, top, width, height} = e.currentTarget.getBoundingClientRect();
        const {clientX, clientY} = e;
        return [(clientX - left) / width, (clientY - top) / height];
    }, [])
    const handleMouseDown = useCallback(e => {
        if (isDrawing) return;
        if (e.button !== 0) return;
        setDrawing(true);
        const cursor = getCursorPos(e);
        setLasso([cursor]);
    }, [isDrawing]);
    const handleMouseMove = useCallback(e => {
        if (!isDrawing) return;
        const cursor = getCursorPos(e);
        setLasso(l => [...l, cursor]);
    }, [isDrawing]);
    const handleMouseUp = useCallback(() => {
        if (!isDrawing) return;
        setDrawing(false);
        setLasso([]);
    }, [isDrawing]);
    return {
        lasso,
        isDrawing,
        handleMouseMove,
        handleMouseDown,
        handleMouseUp,
    }
}