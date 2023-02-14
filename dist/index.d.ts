import { StoreApi } from "zustand";
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
export type GetWritableKeys<T, K = keyof T> = K extends keyof T ? (Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? never : K) : never;
export type GetWritableState<T> = {
    [K in GetWritableKeys<T>]: T[K];
};
export type GetStore<T extends Object, P extends Object = {}> = T & P;
export interface GetReturn<T extends Object, P extends Object = {}> {
    (): [GetStore<T, P>, StoreApi<GetStore<GetWritableState<T>>>["setState"], StoreApi<GetStore<T, P>>["subscribe"]];
    getState: StoreApi<GetStore<T, P>>["getState"];
    setState: StoreApi<GetStore<GetWritableState<T>>>["setState"];
    subscribe: StoreApi<GetStore<T, P>>["subscribe"];
}
declare function createStore<T extends Object>(state: T): GetReturn<T>;
declare function createStore<T extends Object, P extends Object = {}>(state: T, readyOnly: P): GetReturn<T, P>;
export default createStore;
