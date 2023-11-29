import {useCallback, useMemo, useState} from "react";

function pointInLasso(point, lasso) {
    const [x, y] = point;

    let inside = false;
    for (let i = 0, j = lasso.length - 1; i < lasso.length; j = i++) {
        const [xi, yi] = lasso[i], [xj, yj] = lasso[j];

        inside ^= ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    }

    return inside;
}

export default function usePointLassoSelection(points, lasso) {
    return useMemo(() => points.map((_, i) => i)
        .filter(i => pointInLasso(points[i], lasso)), [points, lasso]);
}