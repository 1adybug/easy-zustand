"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zustand_1 = require("zustand");
function createStore(state) {
    return (0, zustand_1.create)(set => (Object.assign(Object.assign({}, state), { setState: (newState) => {
            set(oldState => (Object.assign(Object.assign({}, oldState), newState)));
        } })));
}
exports.default = createStore;
//# sourceMappingURL=index.js.map