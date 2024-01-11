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
    idx: number,
    trajectory: Trajectory
    probability: number
    attention: SingleAttention
}

export interface Strategy {
    predictors: Prediction[]
    attention: StratAttention
}

export type StorylineGroup = number[]

export interface StorylineStage {
    groups: StorylineGroup[]
    instances: number
}

export interface PredictorsStoryline {
    stages: StorylineStage[],
    numPredictors: number,
    totalInstances: number,
}
