import {useCallback, useState} from "react";
import {MAX_X, MAX_Y, MIN_X, MIN_Y} from "../../../utils/game.js";

export default function useAxisRange() {
    const [xRange, setXRange] = useState([MIN_X, MAX_X]);
    const [yRange, setYRange] = useState([MIN_Y, MAX_Y]);
    const onNav = useCallback((xRange, yRange) => {
        setXRange(c => c[0] === xRange[0] && c[1] === xRange[1] ? c : xRange);
        setYRange(c => c[0] === yRange[0] && c[1] === yRange[1] ? c : yRange);
    }, []);
    return {xRange, yRange, onNav};
}