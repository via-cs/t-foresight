export type Position = [number, number]
export type Trajectory = Position[]

export type AttentionStruct<T> = Record<string, Record<string, T>>
export type SingleAttention = AttentionStruct<number>

export interface AttentionRange {
    avg: number
    min: number
    max: number
}
export type StratAttention = AttentionStruct<AttentionRange>

export interface Prediction {
    trajectory: Trajectory
    probability: number
    attention: SingleAttention
}

export interface Strategy {
    predictors: Prediction[]
    attention: StratAttention
}

export type StrategyList = Strategy[];