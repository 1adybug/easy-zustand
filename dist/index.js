"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFrameThrottle = void 0;
const zustand_1 = require("zustand");
function createStore(state, replace) {
    const originUseStore = (0, zustand_1.create)(() => state);
    let setState;
    if (!replace) {
        setState = (newState, replace) => {
            originUseStore.setState(newState, replace !== null && replace !== void 0 ? replace : false);
        };
    }
    else {
        setState = (newState, replace) => {
            originUseStore.setState(newState, replace !== null && replace !== void 0 ? replace : true);
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
function getFrameThrottle() {
    let signal;
    return function frameThrottle(fun) {
        cancelAnimationFrame(signal);
        signal = requestAnimationFrame(fun);
    };
}
exports.getFrameThrottle = getFrameThrottle;
exports.default = createStore;
//# sourceMappingURL=index.js.map