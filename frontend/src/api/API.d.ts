import {Prediction, PredictorsStoryline} from "../model/Strategy";

export interface PredictionRequest {
    gameName: string,
    teamId: 0 | 1,
    playerId: 0 | 1 | 2 | 3 | 4,
    frame: number,
    contextLimit: { ctxGroup: string, ctxItem: string }[]
}

export interface PredictionResponse {
    predictions: Prediction[]
    predGroups: number[][]
    predProjection: [number, number][]
    predInstances: PredictorsStoryline
}