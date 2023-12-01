export type ContextValue = number | string | boolean | number[] | undefined

export interface Context {
    [groupName: string]: {
        [itemName: string]: ContextValue
    }
}