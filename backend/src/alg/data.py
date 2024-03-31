import json
import os
from copy import deepcopy

from src.alg.limits import contexts_list


def decompress(compressed_game_data):
    pre_rec = {
        "tick": 0,
        "game_time": 0,
        "roshan_hp": 0,
        "is_night": False,
        "events": [],
        "heroStates": [[], []],
        "teamStates": [],
    }

    def update_frame(gr):
        pre_rec["tick"] = gr["tick"]
        pre_rec["game_time"] = gr["game_time"]
        if gr.has_key("is_night"):
            pre_rec["is_night"] = gr["is_night"]
        if gr.has_key("roshan_hp"):
            pre_rec["roshan_hp"] = gr["roshan_hp"]
        pre_rec["events"] = gr["events"]
        for i in range(2):
            for j in range(5):
                pre_rec["heroStates"][i][j] = {
                    **pre_rec["heroStates"][i][j],
                    **gr["heroStates"][i][j]
                }
            pre_rec["teamStates"][i] = {
                **pre_rec["teamStates"][i],
                **gr["teamStates"][i]
            }
        return deepcopy(pre_rec)

    return {
        "gameInfo": compressed_game_data["gameInfo"],
        "gameRecords": [update_frame(rec) for rec in compressed_game_data["gameRecords"]]
    }


def load_match(filepath):
    with open(filepath, encoding='utf-8') as f:
        data = json.load(f)
        return decompress(data)


def gen_inst(match, team_id, player_id, frame, lc=10, lx=30, ly=10):
    return {
        "c": [
            match['gameRecords'][i]
            for i in range(frame - lc + 1, frame + 1)
        ],
        "tx": [
            [match['gameRecords'][i]["heroStates"][tid][pid]['position'] for tid in range(2) for pid in range(5)]
            for i in range(frame - lx + 1, frame + 1)
        ],
        "ty": [
            match['gameRecords'][i]["heroStates"][team_id][player_id]['position']
            for i in range(frame + 1, frame + ly + 1)
        ],
    }


def search_inst(folder, filename, team_id, player_id, frame):
    match = load_match(os.path.join(folder, filename))
    return gen_inst(match, team_id, player_id, frame)


def is_similar_inst(inst1, inst2, context_limits):
    limits = set()
    for limit in context_limits:
        ctx_group = limit['ctxGroup']
        ctx_item = limit['ctxItem']
        limits.add(f"{ctx_group}||{ctx_item}")

    for cg_name in contexts_list:
        cg = context_limits[cg_name]
        for ci_name in cg:
            ci = cg[ci_name]
            diff = ci['diff'](inst1, inst2)
            if diff > ci['limits'][int(f"{cg_name}||{ci_name}" in limits)]:
                return False
    return True


def search_similar_inst(folder, target_inst, team_id, player_id, context_limits):
    res = []
    for game in os.listdir(folder):
        match = load_match(os.path.join(folder, game))
        for frame in range(len(match['gameRecords'])):
            inst = gen_inst(match, team_id, player_id, frame)
            if is_similar_inst(inst, target_inst, context_limits):
                res.append(inst)
    return res
