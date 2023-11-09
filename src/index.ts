import { StoreApi, UseBoundStore, create } from "zustand"
import { persist, createJSONStorage, StateStorage, PersistOptions } from "zustand/middleware"

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

export type GetWritableKeys<T, K = keyof T> = K extends keyof T ? (Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? never : K) : never

export type GetWritableState<T> = {
    [K in GetWritableKeys<T>]: T[K]
}

export type GetNewState<T, P extends boolean> = P extends false ? Partial<GetWritableState<T>> : T

export interface UseStore<T, P extends boolean> {
    (): [T, (state: GetNewState<T, P> | ((prevState: T) => GetNewState<T, P>), replace?: boolean) => void]
    origin: UseBoundStore<StoreApi<T>>
    getState(): T
    setState(state: GetNewState<T, P> | ((prevState: T) => GetNewState<T, P>), replace?: boolean): void
    subscribe(listener: (state: T, prevState: T) => void): () => void
}

export type IsPlainObject<T> = T extends Record<string, any> ? (T extends any[] ? false : true) : false

function createStore<T>(state: T): IsPlainObject<T> extends true ? UseStore<T, false> : UseStore<T, true>

function createStore<T>(state: T, replace: false): UseStore<T, false>

function createStore<T>(state: T, replace: true): UseStore<T, true>

function createStore<T, P extends boolean>(state: T, replace?: P): UseStore<T, P> {
    replace ??= !(state !== undefined && state !== null && Object.getPrototypeOf(state) === Object.prototype) as P
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

    useStore.origin = originUseStore
    useStore.setState = setState
    useStore.getState = originUseStore.getState
    useStore.subscribe = originUseStore.subscribe
    return useStore
}

interface CreatePersistentStoreOption<State, T extends boolean | undefined = false> {
    /** 用来标识状态的唯一 id */
    name: string
    /** 改变状态是否完全覆盖，默认为 false */
    replace?: T
    /** 用来持久化的存储，默认是 localStorage */
    storage?: StateStorage | (() => StateStorage)
    partialize?: (state: State) => Partial<State>
    onRehydrateStorage?: (state: State) => ((state?: State, error?: Error) => void) | void
    version?: number
    migrate?: (persistedState: State, version: number) => State | Promise<State>
    merge?: (persistedState: State, currentState: State) => State
    skipHydration?: boolean
}

export type PersistListener<S> = (state: S) => void

export type Write<T, U> = Omit<T, keyof U> & U

export type StorePersist<S, Ps> = {
    persist: {
        setOptions: (options: Partial<PersistOptions<S, Ps>>) => void
        clearStorage: () => void
        rehydrate: () => Promise<void> | void
        hasHydrated: () => boolean
        onHydrate: (fn: PersistListener<S>) => () => void
        onFinishHydration: (fn: PersistListener<S>) => () => void
        getOptions: () => Partial<PersistOptions<S, Ps>>
    }
}

export interface UsePersistentStore<T, P extends boolean> {
    (): [T, (state: GetNewState<T, P> | ((prevState: T) => GetNewState<T, P>), replace?: boolean) => void]
    origin: UseBoundStore<Write<StoreApi<T>, StorePersist<T, T>>>
    getState(): T
    setState(state: GetNewState<T, P> | ((prevState: T) => GetNewState<T, P>), replace?: boolean): void
    subscribe(listener: (state: T, prevState: T) => void): () => void
}

export function createPersistentStore<T extends object>(state: IsPlainObject<T> extends true ? T : never, name: string): UsePersistentStore<T, false>
export function createPersistentStore<T extends object>(state: IsPlainObject<T> extends true ? T : never, option: CreatePersistentStoreOption<T, false>): UsePersistentStore<T, false>
export function createPersistentStore<T extends object>(state: IsPlainObject<T> extends true ? T : never, option: CreatePersistentStoreOption<T, true>): UsePersistentStore<T, true>
export function createPersistentStore<T extends object, P extends boolean>(state: IsPlainObject<T> extends true ? T : never, nameOrOption: CreatePersistentStoreOption<T, P> | string) {
    const defaultReplace = !(state !== undefined && state !== null && Object.getPrototypeOf(state) === Object.prototype)

    if (defaultReplace) {
        throw new TypeError("`createPersistentStore` just supports plain object")
    }

    const option = typeof nameOrOption === "string" ? ({ replace: defaultReplace, name: nameOrOption, storage: localStorage } as CreatePersistentStoreOption<T, typeof defaultReplace>) : nameOrOption
    const { replace = defaultReplace, name, storage, partialize, onRehydrateStorage, version, migrate, merge, skipHydration } = option
    type Z = typeof replace extends true ? true : false

    const o = {
        name,
        storage: createJSONStorage(typeof storage === "function" ? storage : () => storage || localStorage),
        partialize,
        onRehydrateStorage,
        version,
        migrate,
        merge,
        skipHydration
    }

    if (partialize === undefined) delete o.partialize
    if (onRehydrateStorage === undefined) delete o.onRehydrateStorage
    if (version === undefined) delete o.version
    if (migrate === undefined) delete o.migrate
    if (merge === undefined) delete o.merge
    if (skipHydration === undefined) delete o.skipHydration

    const originUseStore = create(persist(() => state, o as any))

    let setState: UseStore<T, Z>["setState"]

    if (!replace) {
        setState = (newState, replace) => {
            originUseStore.setState(newState as any, replace ?? false)
        }
    } else {
        setState = (newState, replace) => {
            originUseStore.setState(newState as any, replace ?? true)
        }
    }

    const useStore: UseStore<T, Z> = () => {
        const state = originUseStore()
        return [state, setState]
    }

    useStore.origin = originUseStore
    useStore.setState = setState
    useStore.getState = originUseStore.getState
    useStore.subscribe = originUseStore.subscribe
    return useStore
}

export default createStore
