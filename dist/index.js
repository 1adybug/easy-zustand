"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zustand_1 = require("zustand");
function createStore(state, readyOnly) {
    if (readyOnly === undefined) {
        const result = (0, zustand_1.create)(set => state);
        const getState = result.getState;
        const setState = result.setState;
        const subscribe = result.subscribe;
        const useStore = () => {
            const state = result();
            return [state, setState, subscribe];
        };
        useStore.getState = getState;
        useStore.setState = setState;
        useStore.subscribe = subscribe;
        return useStore;
    }
    const result = (0, zustand_1.create)(set => (Object.assign(Object.assign({}, state), readyOnly)));
    const getState = result.getState;
    const setState = result.setState;
    const subscribe = result.subscribe;
    const useStore = () => {
        const state = result();
        return [state, setState, subscribe];
    };
    useStore.getState = getState;
    useStore.setState = setState;
    useStore.subscribe = subscribe;
    return useStore;
}
exports.default = createStore;
//# sourceMappingURL=index.js.map