export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
export type GetWritableKeys<T, K = keyof T> = K extends keyof T ? (Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? never : K) : never;
export type GetWritableState<T, P extends boolean> = P extends false ? {
    [K in GetWritableKeys<T>]: T[K];
} : T;
export interface UseStore<T, P extends boolean> {
    (): [T, (state: GetWritableState<T, P> | ((prevState: T) => GetWritableState<T, P>)) => void];
    getState(): T;
    setState(state: GetWritableState<T, P> | ((prevState: T) => GetWritableState<T, P>)): void;
    subscribe(listener: (state: T, prevState: T) => void): () => void;
}
declare function createStore<T>(state: T): UseStore<T, false>;
declare function createStore<T, P extends boolean>(state: T, replace: P): UseStore<T, P>;
export default createStore;
