/**
 *
 * @param {import('src/model/System.js').MatrixCell[][]} data
 * @return {number[]}
 */
function probNext(data) {
    const vec = [0, 0];
    for (const r of data)
        for (const d of r) {
            vec[0] += d.avgDirection[0] * d.probability;
            vec[1] += d.avgDirection[1] * d.probability;
        }
    return vec;
}

export default function useGeneralDir(xData, yData) {
    const xNext = probNext(xData);
    const yNext = probNext(yData);
    return `${yNext[1] < 0 ? 'b' : 't'}${xNext[0] < 0 ? 'l' : 'r'}`;
}