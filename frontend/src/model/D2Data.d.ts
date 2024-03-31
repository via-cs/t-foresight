import {CombatEvent} from "./D2DataEvents";

//! 重要属性用//!标出，其他可以不管

export interface BPInfo {   // 选人/禁用信息（跟本项目基本无关）
    hero: string,           // 英雄名
    is_pick: boolean,       // 选人 or 禁用
    team: string,           // 队伍名
}

export interface PlayerInfo {   // 玩家信息
    player: string,             // 玩家steam名
    hero: string,               //! 英雄名，目前是hover到map view右上角图标的时候显示
    is_fake_client: boolean,    // 是否是AI bot
    steam_id: number,           // steam id
}

export interface TeamInfo {     // 队伍信息
    name: string,               // 队伍名
    players: PlayerInfo[],      //! 5名玩家
}

export interface GameInfo {     // 比赛基础信息
    ticks: number,              // 服务器计数
    match_id: number,           // 比赛id
    winner: string,             //! 胜出方，radiant or dire，可以画出来
    ban_pick: BPInfo[],         // 选人/禁用信息
    radiant: TeamInfo,          //! 地图左下角的队伍
    dire: TeamInfo,             //! 地图右上角的队伍
}

export interface ControlUnit {      // 玩家控制单位（本项目暂不考虑，因为会极大提高项目复杂度）
    name: string,                   // 单位名
    pos: [number, number, number],  // 地图位置
}

export interface ItemState {    // 道具信息（前端不用考虑）
    name: string,
    cd: number,
}

export interface AbilityState { // 技能信息（前端不用考虑）
    name: string,
    cd: number,
    lvl: number,
}

export interface HeroState {        // 玩家状态，前端大部分可以不考虑，但可能有些基础绘制需求
    hp: number,                     //! 当前血量
    mhp: number,                    //! 最大血量
    mp: number,                     //! 当前魔法值
    mmp: number,                    //! 最大魔法值
    lvl: number,                    //! 当前等级，最高30
    exp: number,
    gold: number,                   //! 身价总额
    sight: number,
    dmg: [number, number],
    arm: number,
    mr: number,
    stt: number,
    agl: number,
    itl: number,
    ms: number,
    life: number,                   //! 存活状态 0: alive; 1: dying; 2: died
    pos: [number, number, number],  //! 当前位置，第3维是高度，我们不考虑
    scepter: boolean,
    shard: boolean,
    buffs: string[],
    cu: ControlUnit[],
    items: ItemState[],
    abs: AbilityState[],
}

export interface TeamState {    // 队伍状态
    towers: number[],           // top 1,2,3, middle 1,2,3, bottom 1,2,3, base 1,2
    camps: number[],            // top melee, top ranged, middle melee, middle ranged, bottom melee, bottom ranged
    base: number,
    creeps: number[],           // top/middle/bottom 最前方小兵在兵线上的百分比位置
    guards: number[][],         // 岗哨所在位置
}

export interface GameRecord {   // 每一帧的状态记录
    roshan_hp: number,          //! boss当前血量
    tick: number,
    game_time: number,          //! 游戏时间
    is_night: boolean,          //! 是否夜晚
    heroStates: HeroState[][],  //! 玩家状态
    teamStates: TeamState[],    //! 队伍建筑/小兵状态
    events: CombatEvent[],
}

export interface D2Data {
    gameInfo: GameInfo,         // 游戏基础信息
    gameRecords: GameRecord[]   // 游戏每一帧的状态记录
}
