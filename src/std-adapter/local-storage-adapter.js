"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageAdapter = void 0;
const persistence_adapter_1 = require("../persistence-adapter");
class LocalStorageAdapter extends persistence_adapter_1.PersistenceAdapter {
    getItem(key) {
        return localStorage.getItem(key);
    }
    setItem(key, value) {
        localStorage.setItem(key, value !== null && value !== void 0 ? value : '');
    }
}
exports.LocalStorageAdapter = LocalStorageAdapter;
