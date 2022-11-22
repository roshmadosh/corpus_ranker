export type StateSetter<A> = (state: Partial<A>) => void;

export type FlagType = {
    success: boolean,
    message: string
} 
