import {useMemo} from "react";

export default function useMatrixData(predictions, predictionGroups) {
    return useMemo(() => {
        const f = predictions.map((_, i) => i);
        const find = x => x === f[x] ? x : (f[x] = find(f[x]));
        const merge = (x, y) => f[find(x)] = find(y);
        for (const group of predictionGroups)
            for (let i = 1; i < group.length; i++) merge(group[0], group[i]);
        const res = predictions.map(() => predictions.map(() => 0));
        for (let i = 0; i < predictions.length; i++)
            for (let j = 0; j < predictions.length; j++)
                if (i === j) res[i][j] = 1;
                else if (i < j) res[i][j] = (Math.random() + Number(find(i) === find(j))) * 0.5;
                else res[i][j] = res[j][i];
        return res
    }, [])
}