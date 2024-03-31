import {useCallback, useEffect, useState} from "react";

export default function useHover(ref) {
    const [hover, setHover] = useState(false);
    const mouseEnter = useCallback(() => setHover(true), []);
    const mouseLeave = useCallback(() => setHover(false), []);
    useEffect(() => {
        if (!ref.current) return;
        ref.current.addEventListener('mouseenter', mouseEnter);
        ref.current.addEventListener('mouseleave', mouseLeave);
        return () => {
            ref.current.removeEventListener('mouseenter', mouseEnter);
            ref.current.removeEventListener('mouseleave', mouseLeave);
        }
    }, []);
    return hover;
}