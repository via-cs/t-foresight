import {useCallback, useEffect, useState} from "react";

export default function useKeyPressed(key) {
    const [pressed, setPressed] = useState(false);
    const handleDown = useCallback((e) => (e.key === key) && setPressed(true), [key]);
    const handleUp = useCallback((e) => (e.key === key) && setPressed(false), [key]);
    useEffect(() => {
        window.addEventListener('keydown', handleDown);
        window.addEventListener('keyup', handleUp);
        return () => {
            window.removeEventListener('keydown', handleDown);
            window.removeEventListener('keyup', handleUp);
        }
    }, [handleDown, handleUp]);
    return pressed;
}