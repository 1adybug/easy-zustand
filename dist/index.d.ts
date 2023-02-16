export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
export type GetWritableKeys<T, K = keyof T> = K extends keyof T ? (Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? never : K) : never;
export type GetWritableState<T> = {
    [K in GetWritableKeys<T>]: T[K];
};
export type GetNewState<T, P extends boolean> = P extends false ? Partial<GetWritableState<T>> : T;
export interface UseStore<T, P extends boolean> {
    (): [T, (state: GetNewState<T, P> | ((prevState: T) => GetNewState<T, P>)) => void];
    getState(): T;
    setState(state: GetNewState<T, P> | ((prevState: T) => GetNewState<T, P>)): void;
    subscribe(listener: (state: T, prevState: T) => void): () => void;
}
declare function createStore<T>(state: T): UseStore<T, false>;
declare function createStore<T>(state: T, replace: true): UseStore<T, true>;
declare function createStore<T>(state: T, replace: false): UseStore<T, false>;
export default createStore;
