import { create } from "zustand"

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

export type GetWritableKeys<T, K = keyof T> = K extends keyof T ? (Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? never : K) : never

export type GetWritableState<T> = {
    [K in GetWritableKeys<T>]: T[K]
}

export type GetNewState<T, P extends boolean> = P extends false ? Partial<GetWritableState<T>> : T

export interface UseStore<T, P extends boolean> {
    (): [T, (state: GetNewState<T, P> | ((prevState: T) => GetNewState<T, P>)) => void]
    getState(): T
    setState(state: GetNewState<T, P> | ((prevState: T) => GetNewState<T, P>)): void
    subscribe(listener: (state: T, prevState: T) => void): () => void
}

function createStore<T>(state: T): UseStore<T, false>

function createStore<T>(state: T, replace: true): UseStore<T, true>

function createStore<T>(state: T, replace: false): UseStore<T, false>

function createStore<T, P extends boolean = boolean>(state: T, replace?: P): UseStore<T, P> {
    const originUseStore = create(() => state)

    let setState: UseStore<T, P>["setState"]

    if (!!replace) {
        setState = newState => {
            originUseStore.setState(newState as Partial<T> | ((prevState: T) => Partial<T>), false)
        }
    } else {
        setState = newState => {
            originUseStore.setState(newState as T | ((prevState: T) => T), true)
        }
    }

    const useStore: UseStore<T, P> = () => {
        const state = originUseStore()
        return [state, setState]
    }

    useStore.setState = setState
    useStore.getState = originUseStore.getState
    useStore.subscribe = originUseStore.subscribe

    return useStore
}

export default createStore
