"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zustand_1 = require("zustand");
function createStore(state, replace) {
    const originUseStore = (0, zustand_1.create)(() => state);
    let setState;
    if (!replace) {
        setState = newState => {
            originUseStore.setState(newState, false);
        };
    }
    else {
        setState = newState => {
            originUseStore.setState(newState, true);
        };
    }
    const useStore = () => {
        const state = originUseStore();
        return [state, setState];
    };
    useStore.setState = setState;
    useStore.getState = originUseStore.getState;
    useStore.subscribe = originUseStore.subscribe;
    return useStore;
}
exports.default = createStore;
//# sourceMappingURL=index.js.map