"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zustand_1 = require("zustand");
function createStore(state, readyOnly) {
    if (readyOnly === undefined) {
        return (0, zustand_1.create)(set => (Object.assign(Object.assign({}, state), { setState: newState => {
                if (typeof newState === "function") {
                    set(oldState => newState(oldState));
                    return;
                }
                set(newState);
            } })));
    }
    return (0, zustand_1.create)(set => (Object.assign(Object.assign(Object.assign({}, state), { setState: newState => {
            if (typeof newState === "function") {
                set(oldState => newState(oldState));
                return;
            }
            set(newState);
        } }), readyOnly)));
}
exports.default = createStore;
//# sourceMappingURL=index.js.map