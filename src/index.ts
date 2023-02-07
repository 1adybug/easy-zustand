import { create, StoreApi } from "zustand"

type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

type GetWritableKeys<T, K = keyof T> = K extends keyof T ? (Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? never : K) : never

type GetWritableState<T> = {
    [K in GetWritableKeys<T>]: T[K]
}

type GetStore<T extends Object, P extends Object = {}> = T & P

interface GetReturn<T extends Object, P extends Object = {}> {
    (): [GetStore<T, P>, StoreApi<GetStore<GetWritableState<T>>>["setState"], StoreApi<GetStore<T, P>>["subscribe"]]
    getState: StoreApi<GetStore<T, P>>["getState"]
    setState: StoreApi<GetStore<GetWritableState<T>>>["setState"]
    subscribe: StoreApi<GetStore<T, P>>["subscribe"]
}

function createStore<T extends Object>(state: T): GetReturn<T>

function createStore<T extends Object, P extends Object = {}>(state: T, readyOnly: P): GetReturn<T, P>

function createStore<T extends Object, P extends Object = {}>(state: T, readyOnly?: P) {
    if (readyOnly === undefined) {
        type Store = GetStore<T>
        const result = create<Store>(set => state)
        const getState = result.getState
        const setState = result.setState as StoreApi<GetStore<GetWritableState<T>>>["setState"]
        const subscribe = result.subscribe
        const useStore: GetReturn<T> = () => {
            const state = result()
            return [state, setState, subscribe]
        }
        useStore.getState = getState
        useStore.setState = setState
        useStore.subscribe = subscribe
        return useStore
    }
    type Store = GetStore<T, P>
    const result = create<Store>(set => ({ ...state, ...readyOnly }))
    const getState = result.getState
    const setState = result.setState as StoreApi<GetStore<GetWritableState<T>>>["setState"]
    const subscribe = result.subscribe
    const useStore: GetReturn<T, P> = () => {
        const state = result()
        return [state, setState, subscribe]
    }
    useStore.getState = getState
    useStore.setState = setState
    useStore.subscribe = subscribe
    return useStore
}

export default createStore
