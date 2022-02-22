"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
const rxjs_1 = require("rxjs");
const local_storage_adapter_1 = require("./std-adapter/local-storage-adapter");
class State {
    constructor(persistenceKey, persistenceAdapter = new local_storage_adapter_1.LocalStorageAdapter()) {
        this.persistenceKey = persistenceKey;
        this.persistenceAdapter = persistenceAdapter;
        this.sub = new rxjs_1.BehaviorSubject(this.fromLocalStorage());
    }
    fromLocalStorage() {
        if (this.persistenceKey) {
            const content = this.persistenceAdapter.getItem(this.persistenceKey);
            if (content) {
                return JSON.parse(content);
            }
        }
        return this.onCreate();
    }
    get obs() {
        return this.sub.pipe((0, rxjs_1.filter)((val) => val !== undefined));
    }
    store() {
        if (this.persistenceKey) {
            this.persistenceAdapter.setItem(this.persistenceKey, JSON.stringify(this.sub.value));
        }
        else {
            throw new Error('You have to set persistence key in state constructor to store a state');
        }
    }
    get val() {
        var _a;
        return (_a = this.sub.value) !== null && _a !== void 0 ? _a : this.onCreate();
    }
    set(value) {
        var _a;
        const actualValue = JSON.parse(JSON.stringify((_a = this.sub.value) !== null && _a !== void 0 ? _a : {}));
        this.sub.next(Object.assign(Object.assign({}, actualValue), value));
    }
}
exports.State = State;
