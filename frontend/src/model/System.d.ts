export interface MatrixCell {
    probability: number
    avgDirection: [number, number],
    dirRange: number[],
    // @ts-ignore
    predictionIdxes: Set<number>
}