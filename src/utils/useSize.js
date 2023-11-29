import {useLayoutEffect, useState} from "react";

export default function useSize(ref) {
    const [size, setSize] = useState({width: 1, height: 1});
    useLayoutEffect(() => {
        if (!ref.current) return;
        const box = ref.current.getBoundingClientRect();
        setSize({width: box.width, height: box.height});
    }, [])
    return size;
}