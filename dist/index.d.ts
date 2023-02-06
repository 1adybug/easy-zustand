import { UseBoundStore, StoreApi } from "zustand";
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
type GetWritableKeys<T, K = keyof T> = K extends keyof T ? (Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? never : K) : never;
type GetWritableState<T> = {
    [K in GetWritableKeys<T>]: T[K];
};
type GetSetState<T extends Object> = (newState: Partial<GetWritableState<T>> | ((oldState: T) => Partial<GetWritableState<T>>)) => void;
type GetStore<T extends Object, P extends Object = {}> = T & {
    setState: GetSetState<T>;
} & P;
declare function createStore<T extends Object>(state: T): UseBoundStore<StoreApi<GetStore<T>>>;
declare function createStore<T extends Object, P extends Object = {}>(state: T, readyOnly: P): UseBoundStore<StoreApi<GetStore<T, P>>>;
export default createStore;
