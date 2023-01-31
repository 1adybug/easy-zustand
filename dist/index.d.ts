export default function createStore<T extends Object>(state: T): import("zustand").UseBoundStore<import("zustand").StoreApi<T & {
    setState: (newState: Partial<T>) => void;
}>>;
