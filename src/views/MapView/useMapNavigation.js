import {useState} from "react";
import {MAX_Y, MIN_X, MIN_Y} from "../../utils/game.js";

const ensureSize = (x, scale, mapSize) => {
    return Math.min(0, Math.max(mapSize - mapSize * scale, x));
}

export default function useMapNavigation(mapSize, ref) {
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState([0, 0]);
    const setNav = (scale, offset, anim = false) => {
        setScale(scale);
        setOffset(offset);
        if (!ref.current) return;
        if (anim)
            ref.current.to({
                scaleX: scale,
                scaleY: scale,
                x: offset[0],
                y: offset[1],
                duration: .3,
            })
        else {
            ref.current.scaleX(scale);
            ref.current.scaleY(scale);
            ref.current.x(offset[0]);
            ref.current.y(offset[1]);
        }
    }
    const handleRecover = () => setNav(1, [0, 0], true);
    const handleWheel = e => {
        e.evt.preventDefault();
        const scaleBy = 1.02;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };

        const newScale = Math.max(
            1,
            e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy
        );
        const newX = -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale;
        const newY = -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale;

        setNav(
            Math.max(1, newScale),
            [
                ensureSize(newX, newScale, mapSize),
                ensureSize(newY, newScale, mapSize)
            ]
        );
    }
    const dragBoundFunc = pos => {
        return {
            x: ensureSize(pos.x, scale, mapSize),
            y: ensureSize(pos.y, scale, mapSize),
        }
    }
    const autoFocus = (centerPos, radius) => {
        const WH = MAX_Y - MIN_Y;
        const scale = WH / 2 / radius;
        setNav(scale, [
            ensureSize(mapSize * scale * (radius + MIN_X - centerPos[0]) / WH, scale, mapSize),
            ensureSize(mapSize * scale * (centerPos[1] - MIN_X + radius - WH) / WH, scale, mapSize),
        ], true);
    }

    return {
        scale,
        offset,
        handleRecover,
        handleWheel,
        autoFocus,
        dragBoundFunc,
    }
}
