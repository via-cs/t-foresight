from sklearn.cluster import AffinityPropagation
import numpy as np

from src.alg.catsne import catsne


def aggregate_workers(feature_vectors):
    feature_vectors = np.array(feature_vectors)
    clustering = AffinityPropagation(random_state=42).fit(feature_vectors)
    labels = clustering.labels_.to_list()
    pred_groups = [[] for _ in range(max(labels) + 1)]
    for i, g in enumerate(labels):
        pred_groups[g].append(i)
    return pred_groups


def proj(groups, feature_vectors):
    labels = [0 for i in range(20)]
    for gid, group in enumerate(groups):
        for i in group:
            labels[i] = gid
    pos, _ = catsne(feature_vectors, labels)
    return pos


def extend_stage(stages, pred_groups):
    g_key = lambda gs: '|'.join([','.join(g) for g in gs])
    new_stage_flag = True
    for group in pred_groups:
        group.sort()
    pred_groups.sort(key=lambda x: x[0])
    group_key = g_key(pred_groups[0])
    for stage in stages:
        if group_key == g_key(stage['groups']):
            stage['instances'] += 1
            new_stage_flag = False
            break
    if new_stage_flag:
        stages.append({
            'groups': pred_groups,
            "instances": 1,
        })
