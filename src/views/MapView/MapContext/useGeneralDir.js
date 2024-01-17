function probNext(data) {
    const vec = [0, 0];
    for (const r of data)
        for (const d of r) {
            vec[0] += d[1][0] * d[0];
            vec[1] += d[1][1] * d[0];
        }
    return vec;
}

export default function useGeneralDir(xData, yData) {
    const xNext = probNext(xData);
    const yNext = probNext(yData);
    return `${yNext[1] < 0 ? 'b' : 't'}${xNext[0] < 0 ? 'l' : 'r'}`;
}