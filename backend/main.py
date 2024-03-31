from fastapi import FastAPI

from src.alg.data import search_inst, search_similar_inst
from src.alg.interpret import aggregate_workers, proj, extend_stage
from src.model.model import Model

app = FastAPI()


@app.post("/prediction")
async def root(data):
    game_name = data["gameName"]
    team_id = data["teamId"]
    player_id = data["playerId"]
    frame = data["frame"]
    context_limit = data["contextLimit"]

    inst = search_inst('./data', game_name, team_id, player_id, frame)
    similar_inst = search_similar_inst('./data', inst, team_id, player_id, context_limit)

    model = Model.load('./model/v3')
    feature_vectors = [[] for _ in model.workers]
    stages = []
    for simi_inst in similar_inst:
        predictions = model.predict(simi_inst)
        feature_vectors_4_single_inst = [[] for _ in model.workers]
        for i, worker_pred in enumerate(predictions):
            fv = []
            for g_name in worker_pred['attention']:
                for i_name in worker_pred['attention'][g_name]:
                    fv.append(worker_pred['attention'][g_name][i_name])
            for pos in worker_pred['trajectory']:
                fv.append(pos[0])
                fv.append(pos[1])
            feature_vectors[i].extend(fv)
            feature_vectors_4_single_inst[i].extend(fv)

        pred_groups = aggregate_workers(feature_vectors_4_single_inst)
        extend_stage(stages, pred_groups)

    pred_groups = aggregate_workers(feature_vectors)
    pred_projection = proj(pred_groups, feature_vectors)

    return {
        "predictions": model.predict(inst),
        "predGroups": pred_groups,
        "predProjection": pred_projection,
        "predInstances": {
            "stages": stages,
            "numPredictors": model.K,
            "totalInstances": len(similar_inst)
        },
    }
