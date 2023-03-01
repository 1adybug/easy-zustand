"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPersistentStore = exports.getFrameThrottle = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
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
function createPersistentStore(state, nameOrOption) {
    const option = typeof nameOrOption === "string" ? { replace: false, name: nameOrOption, storage: localStorage } : nameOrOption;
    const { replace, name, storage } = option;
    const originUseStore = (0, zustand_1.create)((0, middleware_1.persist)(() => state, {
        name,
        storage: (0, middleware_1.createJSONStorage)(() => storage || localStorage)
    }));
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
exports.createPersistentStore = createPersistentStore;
exports.default = createStore;
//# sourceMappingURL=index.js.map