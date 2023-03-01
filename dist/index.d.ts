export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
export type GetWritableKeys<T, K = keyof T> = K extends keyof T ? (Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? never : K) : never;
export type GetWritableState<T> = {
    [K in GetWritableKeys<T>]: T[K];
};
export type GetNewState<T, P extends boolean> = P extends false ? Partial<GetWritableState<T>> : T;
export interface UseStore<T, P extends boolean> {
    (): [T, (state: GetNewState<T, P> | ((prevState: T) => GetNewState<T, P>)) => void];
    getState(): T;
    setState(state: GetNewState<T, P> | ((prevState: T) => GetNewState<T, P>), replace?: boolean): void;
    subscribe(listener: (state: T, prevState: T) => void): () => void;
}
declare function createStore<T>(state: T): UseStore<T, false>;
declare function createStore<T, P extends boolean>(state: T, replace: P): UseStore<T, P>;
export declare function getFrameThrottle(): (fun: () => any) => void;
interface CreatePersistentStoreOption<T extends boolean | undefined = false> {
    /** 用来标识状态的唯一 id */
    name: string;
    /** 改变状态是否完全覆盖，默认为 false */
    replace?: T;
    /** 用来持久化的存储，默认是 localStorage */
    storage?: Window["sessionStorage"] | Window["localStorage"];
}
export interface PersistentStoreOption {
    /** 用来标识状态的唯一 id */
    name: string;
    /** 改变状态是否完全覆盖，默认为 false */
    replace?: boolean;
    /** 用来持久化的存储，默认是 localStorage */
    storage?: Window["sessionStorage"] | Window["localStorage"];
}
export declare function createPersistentStore<T>(state: T, name: string): UseStore<T, false>;
export declare function createPersistentStore<T, P extends undefined>(state: T, option: CreatePersistentStoreOption<P>): UseStore<T, false>;
export declare function createPersistentStore<T, P extends boolean>(state: T, option: CreatePersistentStoreOption<P>): UseStore<T, P>;
export default createStore;
