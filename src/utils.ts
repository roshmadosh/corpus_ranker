export type StateSetter<A> = (state: A) => void;

export type FlagType = {
    success: boolean,
    message: string
} 
