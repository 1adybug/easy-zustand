import { isPlainObject } from "lodash-es"
import { StoreApi, UseBoundStore, create } from "zustand"
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware"
export { isPlainObject } from "lodash-es"

export interface StateStorage {
    getItem: (name: string) => string | null | Promise<string | null>
    setItem: (name: string, value: string) => any | Promise<any>
    removeItem: (name: string) => any | Promise<any>
}

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
    replace ??= !isPlainObject(state) as P
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
    /** 这是唯一必需的选项。给定的名称将是用于在存储中存储 Zustand 状态的密钥，因此它必须是唯一的 */
    name: string
    /** 改变状态是否完全覆盖，默认为 false */
    replace?: T
    /** 用来持久化的存储，默认是 localStorage */
    storage?: StateStorage | (() => StateStorage)
    /** 选择存储哪些字段 */
    partialize?: (state: State) => Partial<State>
    /** 用于在重新加载状态时调用的回调 */
    onRehydrateStorage?: (state: State) => ((state?: State, error?: Error) => void) | void
    /** 如果您想在存储中引入重大更改（例如重命名字段），您可以指定新的版本号。默认情况下，如果存储中的版本与代码中的版本不匹配，则不会使用存储的值。您可以使用迁移功能（见下文）来处理重大更改，以便保留以前存储的数据 */
    version?: number
    /** 您可以使用此选项来处理版本迁移。 migrate 函数将持久状态和版本号作为参数。它必须返回符合最新版本（代码中的版本）的状态。 */
    migrate?: (persistedState: State, version: number) => State | Promise<State>
    /** 在某些情况下，您可能希望使用自定义合并函数将持久值与当前状态合并。 */
    merge?: (persistedState: State, currentState: State) => State
    /** 默认情况下，存储将在初始化时被水化。 */
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
    const defaultReplace = !isPlainObject(state)

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

interface CreatePersistentSignalStoreOption {
    /** 这是唯一必需的选项。给定的名称将是用于在存储中存储 Zustand 状态的密钥，因此它必须是唯一的 */
    name: string
    /** 用来持久化的存储，默认是 localStorage */
    storage?: StateStorage | (() => StateStorage)
    /** 如果您想在存储中引入重大更改（例如重命名字段），您可以指定新的版本号。默认情况下，如果存储中的版本与代码中的版本不匹配，则不会使用存储的值。您可以使用迁移功能（见下文）来处理重大更改，以便保留以前存储的数据 */
    version?: number
}

export interface UsePersistentSignalStore<T> {
    (): [T, (state: T | ((prevState: T) => T)) => void]
    getState(): T
    setState(state: T | ((prevState: T) => T)): void
    subscribe(listener: (state: T, prevState: T) => void): () => void
}

/** 创建非对象类型 */
export function createPersistentSignalStore<T>(state: T, name: string): UsePersistentSignalStore<T>
export function createPersistentSignalStore<T>(state: T, option: CreatePersistentSignalStoreOption): UsePersistentSignalStore<T>
export function createPersistentSignalStore<T>(state: T, nameOrOption: CreatePersistentSignalStoreOption | string) {
    const option: CreatePersistentSignalStoreOption = typeof nameOrOption === "string" ? { name: nameOrOption, storage: localStorage } : nameOrOption

    const { name, storage, version } = option

    const o = {
        name,
        storage: createJSONStorage(typeof storage === "function" ? storage : () => storage || localStorage),
        version
    }

    const originUseStore = create(persist(() => ({ value: state }), o))

    function getState() {
        return originUseStore.getState().value
    }

    function setState(newState: T | ((prevState: T) => T)) {
        const prevState = getState()
        if (typeof newState !== "function") {
            if (newState === prevState) return
            return originUseStore.setState({ value: newState })
        }
        const nextState = (newState as (prevState: T) => T)(prevState)
        if (nextState === prevState) return
        originUseStore.setState({ value: nextState })
    }

    function subscribe(listener: (state: T, prevState: T) => void) {
        return originUseStore.subscribe((state, prevState) => listener(state.value, prevState.value))
    }

    const useStore: UsePersistentSignalStore<T> = () => {
        const { value: state } = originUseStore()
        return [state, setState]
    }

    useStore.getState = getState
    useStore.setState = setState
    useStore.subscribe = subscribe
    return useStore
}

export default createStore
