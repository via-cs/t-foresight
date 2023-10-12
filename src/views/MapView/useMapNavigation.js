import {useState} from "react";

const ensureSize = (x, scale, mapSize) => {
    return Math.min(0, Math.max(mapSize - mapSize * scale, x));
}

export default function useMapNavigation(mapSize) {
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState([0, 0]);
    const handleRecover = () => {
        setScale(1);
        setOffset([0, 0]);
    }
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

        setScale(Math.max(1, newScale));
        setOffset([
            ensureSize(newX, newScale, mapSize),
            ensureSize(newY, newScale, mapSize)
        ]);
    }
    const dragBoundFunc = pos => {
        return {
            x: ensureSize(pos.x, scale, mapSize),
            y: ensureSize(pos.y, scale, mapSize),
        }
    }

    return {
        scale,
        offset,
        handleRecover,
        handleWheel,
        dragBoundFunc,
    }
}
