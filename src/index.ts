import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

export type GetWritableKeys<T, K = keyof T> = K extends keyof T ? (Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? never : K) : never

export type GetWritableState<T> = {
    [K in GetWritableKeys<T>]: T[K]
}

export type GetNewState<T, P extends boolean> = P extends false ? Partial<GetWritableState<T>> : T

export interface UseStore<T, P extends boolean> {
    (): [T, (state: GetNewState<T, P> | ((prevState: T) => GetNewState<T, P>)) => void]
    getState(): T
    setState(state: GetNewState<T, P> | ((prevState: T) => GetNewState<T, P>), replace?: boolean): void
    subscribe(listener: (state: T, prevState: T) => void): () => void
}

function createStore<T>(state: T): UseStore<T, false>

function createStore<T>(state: T, replace: false): UseStore<T, false>

function createStore<T>(state: T, replace: true): UseStore<T, true>

function createStore<T, P extends boolean>(state: T, replace?: P): UseStore<T, P> {
    const originUseStore = create(() => state)

    let setState: UseStore<T, P>["setState"]

    if (!replace) {
        setState = (newState, replace) => {
            originUseStore.setState(newState as Partial<T> | ((prevState: T) => Partial<T>), replace ?? false)
        }
    } else {
        setState = (newState, replace) => {
            originUseStore.setState(newState as T | ((prevState: T) => T), replace ?? true)
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

export function getFrameThrottle() {
    let signal: number
    return function frameThrottle(fun: () => any) {
        cancelAnimationFrame(signal)
        signal = requestAnimationFrame(fun)
    }
}

interface CreatePersistentStoreOption<T extends boolean | undefined = false> {
    /** 用来标识状态的唯一 id */
    name: string
    /** 改变状态是否完全覆盖，默认为 false */
    replace?: T
    /** 用来持久化的存储，默认是 localStorage */
    storage?: Window["sessionStorage"] | Window["localStorage"]
}

export interface PersistentStoreOption {
    /** 用来标识状态的唯一 id */
    name: string
    /** 改变状态是否完全覆盖，默认为 false */
    replace?: boolean
    /** 用来持久化的存储，默认是 localStorage */
    storage?: Window["sessionStorage"] | Window["localStorage"]
}

export function createPersistentStore<T>(state: T, name: string): UseStore<T, false>
export function createPersistentStore<T>(state: T, option: CreatePersistentStoreOption<false>): UseStore<T, false>
export function createPersistentStore<T>(state: T, option: CreatePersistentStoreOption<true>): UseStore<T, true>
export function createPersistentStore<T, P extends boolean>(state: T, nameOrOption: CreatePersistentStoreOption<P> | string) {
    const option = typeof nameOrOption === "string" ? { replace: false, name: nameOrOption, storage: localStorage } : nameOrOption

    const { replace, name, storage } = option

    type Z = typeof replace extends true ? true : false

    const originUseStore = create(
        persist(() => state, {
            name,
            storage: createJSONStorage(() => storage || localStorage)
        })
    )

    let setState: UseStore<T, Z>["setState"]

    if (!replace) {
        setState = (newState, replace) => {
            originUseStore.setState(newState as Partial<T> | ((prevState: T) => Partial<T>), replace ?? false)
        }
    } else {
        setState = (newState, replace) => {
            originUseStore.setState(newState as T | ((prevState: T) => T), replace ?? true)
        }
    }

    const useStore: UseStore<T, Z> = () => {
        const state = originUseStore()
        return [state, setState]
    }

    useStore.setState = setState
    useStore.getState = originUseStore.getState
    useStore.subscribe = originUseStore.subscribe

    return useStore
}

export default createStore
