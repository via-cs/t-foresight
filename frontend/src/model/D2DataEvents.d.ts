interface BaseCombatEvent {
    type: string,
    timestamp: number,
}

export interface DamageEvent extends BaseCombatEvent {
    attacker: string,
    target: string,
    inflictor: string,
    health: number,
}

export interface HealEvent extends BaseCombatEvent {
    attacker: string,
    target: string,
    inflictor: string,
    health: number,
    heal_val: number,
}

export interface ModifierAddEvent extends BaseCombatEvent {
    attacker: string,
    target: string,
    inflictor: string,
}

export interface ModifierRemoveEvent extends BaseCombatEvent {
    target: string,
    inflictor: string,
}

export interface DeathEvent extends BaseCombatEvent {
    attacker: string,
    target: string,
}

export interface AbilityEvent extends BaseCombatEvent {
    attacker: string,
    target: string,
    inflictor: string,
    level: number,
    toggle_on: boolean,
    toggle_off: boolean,
}

export interface ItemEvent extends BaseCombatEvent {
    attacker: string,
    inflictor: string,
}

export interface LocationEvent extends BaseCombatEvent {
    x: number,
    y: number,
}

export interface GoldEvent extends BaseCombatEvent {
    target: string,
    gold: number,
}

export interface GameStateEvent extends BaseCombatEvent {
    game_state: number,
}

export interface XPEvent extends BaseCombatEvent {
    target: string,
    xp: number,
}

export interface PurchaseEvent extends BaseCombatEvent {
    target: string,
    item: string,
}

export interface BuyBackEvent extends BaseCombatEvent {
    slot: number,
}

export interface AbilityTriggerEvent extends BaseCombatEvent {
    attacker: string,
    target: string,
    inflictor: string,
    level: number,
}

export interface MultiKillEvent extends BaseCombatEvent {
    target: string,
    attacker: string,
}

export interface KillStreakEvent extends BaseCombatEvent {
    target: string,
    attacker: string,
}

export interface TeamBuildingKillEvent extends BaseCombatEvent {
    target: string,
    target_team: number,
    attacker_team: number,
    death_count: number,
}

export interface FirstBloodEvent extends BaseCombatEvent {
    attacker_team: number,
    assist_players: number[],
}

export type CombatEvent =
    | DamageEvent
    | HealEvent
    | ModifierAddEvent
    | ModifierRemoveEvent
    | DeathEvent
    | AbilityEvent
    | ItemEvent
    | LocationEvent
    | GoldEvent
    | GameStateEvent
    | XPEvent
    | PurchaseEvent
    | BuyBackEvent
    | AbilityTriggerEvent
    | MultiKillEvent
    | KillStreakEvent
    | TeamBuildingKillEvent
    | FirstBloodEvent
