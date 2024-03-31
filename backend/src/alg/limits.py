import math


def dis(pos_a, pos_b):
    dx = pos_a[0] - pos_b[0]
    dy = pos_a[1] - pos_b[1]
    return math.sqrt(dx * dx + dy * dy)


def tower_limit(tid, tower_id):
    return {
        "diff": lambda a, b: abs(
            a['c'][-1]['teamStates'][tid]['towers'][tower_id]
            - b['c'][-1]['teamStates'][tid]['towers'][tower_id]
        ),
        "limits": [2500, 500],
    }


def creep_limit(tid, creep_id):
    return {
        "diff": lambda a, b: dis(
            a['c'][-1]['teamStates'][tid]['creeps'][creep_id],
            b['c'][-1]['teamStates'][tid]['creeps'][creep_id]
        ),
        "limits": [30000, 2000],
    }


def team_limits(tid):
    return {
        "towerTop1": tower_limit(tid, 0),
        "towerTop2": tower_limit(tid, 1),
        "towerTop3": tower_limit(tid, 2),
        "towerMid1": tower_limit(tid, 3),
        "towerMid2": tower_limit(tid, 4),
        "towerMid3": tower_limit(tid, 5),
        "towerBot1": tower_limit(tid, 6),
        "towerBot2": tower_limit(tid, 7),
        "towerBot3": tower_limit(tid, 8),
        "towerBase1": tower_limit(tid, 9),
        "towerBase2": tower_limit(tid, 10),
        "creepTop": creep_limit(tid, 0),
        "creepMid": creep_limit(tid, 1),
        "creepBot": creep_limit(tid, 2),
    }


def player_limits(tid, pid):
    def ps(inst):
        return inst['c'][-1]['heroStates'][tid][pid]

    return {
        "health": {
            "diff": lambda x, y: abs(ps(x)['hp'] - ps(y)['hp']),
            'limits': [2000, 500],
        },
        "mana": {
            "diff": lambda x, y: abs(ps(x)['mp'] - ps(y)['mp']),
            'limits': [2000, 300],
        },
        "position": {
            "diff": lambda x, y: dis(ps(x)['pos'], ps(y)['pos']),
            'limits': [5000, 1500],
        },
        "level": {
            "diff": lambda x, y: abs(ps(x)['lvl'] - ps(y)['lvl']),
            'limits': [5, 2],
        },
        "isAlive": {
            "diff": lambda x, y: abs(int(ps(x)['ls']) - int(ps(y)['ls'])),
            'limits': [1, 0],
        },
        "gold": {
            "diff": lambda x, y: abs(ps(x)['gold']) - int(ps(y)['gold']),
            'limits': [4000, 2000],
        },
    }


contexts_list = {
    't0': team_limits,
    't1': team_limits,
    'p00': player_limits(0, 0),
    'p01': player_limits(0, 1),
    'p02': player_limits(0, 2),
    'p03': player_limits(0, 3),
    'p04': player_limits(0, 4),
    'p10': player_limits(1, 0),
    'p11': player_limits(1, 1),
    'p12': player_limits(1, 2),
    'p13': player_limits(1, 3),
    'p14': player_limits(1, 4),
    'g': {
        "gameTime": {
            "diff": lambda x, y: abs(x['c'][-1]['gameTime'] - y['c'][-1]['gameTime']),
            'limits': [600, 120],
        },
        "isNight": {
            "diff": lambda x, y: abs(int(x['c'][-1]['isNight']) - int(y['c'][-1]['isNight'])),
            'limits': [1, 0],
        },
        "roshanHP": {
            "diff": lambda x, y: abs(x['c'][-1]['roshanHP'] - y['c'][-1]['roshanHP']),
            'limits': [5000, 1000],
        },
    }
}
