import {MAX_X, MAX_Y, MIN_X, MIN_Y} from "../../../utils/game.js";

const WW = MAX_X - MIN_X;
const WH = MAX_Y - MIN_Y;
/**
 *
 * @param {[number, number]} centerPos
 * @param {number} radius
 * @return {{scale: number, offset: [number, number]}}
 */
export default function useFocusMapArea(centerPos, radius, mapSize) {
    const scale = WH / 2 / radius;
    return {
        scale,
        offset: [
            mapSize * scale * (radius + MIN_X - centerPos[0]) / WH,
            mapSize * scale * (centerPos[1] - MIN_X + radius - WH) / WH,
        ],
    }
}

console.log(useFocusMapArea(
    [
        (MAX_X + MIN_X) / 2,
        (MAX_Y + MIN_Y) / 2,
    ],
    (MAX_Y - MIN_Y) / 2,
    100
))
