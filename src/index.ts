import { create } from "zustand"

export default function createStore<T extends Object>(state: T) {
    type SetState = (newState: Partial<T>) => void
    return create<T & { setState: SetState }>(set => ({
        ...state,
        setState: (newState: Partial<T>) => {
            set(oldState => ({ ...oldState, ...newState }))
        }
    }))
}