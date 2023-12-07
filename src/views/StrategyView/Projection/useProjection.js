import {useMemo} from "react";
import {rand} from "../../../utils/fakeData.js";

export default function useProjection(predictors, groups) {
    return useMemo(() => {
        const pos = [];
        const sectionRad = Math.PI * 2 / groups.length;
        groups.forEach((g, i) => {
            const rad = (i + rand(0.25, 0.75)) * sectionRad,
                r = rand(0.25, 0.4);
            const cx = 0.5 + Math.cos(rad) * r, cy = 0.5 + Math.sin(rad) * r;
            g.forEach(i => pos[i] = [
                (Math.random() * 2 - 1) * 0.15 + cx,
                (Math.random() * 2 - 1) * 0.15 + cy,
                1,
            ])
        })
        return pos;
    }, [predictors]);
}