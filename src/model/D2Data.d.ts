import {CombatEvent} from "./D2DataEvents";

export interface BPInfo {
    hero: string,
    is_pick: boolean,
    team: string,
}

export interface PlayerInfo {
    player: string,
    hero: string,
    is_fake_client: boolean,
    steam_id: number,
}

export interface TeamInfo {
    name: string,
    players: PlayerInfo[],
}

export interface GameInfo {
    ticks: number,
    match_id: number,
    winner: string,
    ban_pick: BPInfo[],
    radiant: TeamInfo,
    dire: TeamInfo,
}

export interface ControlUnit {
    name: string,
    pos: [number, number, number],
}

export interface ItemState {
    name: string,
    cd: number,
}

export interface AbilityState {
    name: string,
    cd: number,
    lvl: number,
}

export interface HeroState {
    hp: number,                                                     // hp
    mhp: number,                                                    // max hp
    mp: number,                                                     // mp
    mmp: number,                                                    // max mp
    lvl: number,                                                    // level
    exp: number,                                                    // current exp
    gold: number,                                                   // net worth
    sight: number,                                                  // sight area
    dmg: [number, number],                                          // [min damage, max damage]
    arm: number,                                                    // armor
    mr: number,                                                     // magical resistance
    stt: number,                                                    // strength
    agl: number,                                                    // agility
    itl: number,                                                    // intelligence
    ms: number,                                                     // move speed
    life: number,                                                   // 0: alive; 1: dying; 2: died
    pos: [number, number, number],                                  // position
    scepter: boolean,                                               // TODO: Aghanims Scepter
    shard: boolean,                                                 // TODO: Aghanims Shard
    buffs: string[],                                                // TODO: buffs
    cu: ControlUnit[],                                              // TODO: control units
    items: ItemState[],                                             // items
    abs: AbilityState[];                                            // ability states
}

export interface TeamState {
    towers: number[], // top 1,2,3, middle 1,2,3, bottom 1,2,3, base 1,2
    camps: number[], // top melee, top ranged, middle melee, middle ranged, bottom melee, bottom ranged
    base: number,
    creeps: number[], // top/middle/bottom 最前方小兵在兵线上的百分比位置
    guards: number[][], // 岗哨所在位置
}

export interface GameRecord {
    roshan_hp: number;
    tick: number,
    game_time: number,
    is_night: boolean,
    heroStates: HeroState[][],
    teamStates: TeamState[],
    events: CombatEvent[],
}

export interface D2Data {
    gameInfo: GameInfo,
    gameRecords: GameRecord[]
}
