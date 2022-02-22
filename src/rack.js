"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rack = void 0;
const state_1 = require("./state");
const rxjs_1 = require("rxjs");
class Rack extends state_1.State {
    constructor(state, locaStorageKey) {
        super();
        this.state = state;
    }
    onCreate() {
        return this.state;
    }
    get obs() {
        return (0, rxjs_1.merge)(Object.keys(this.state).map(key => this.state[key].obs)).pipe((0, rxjs_1.filter)((val) => val !== undefined));
    }
    refreshState() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const key of Object.keys(this.state)) {
                this.state[key].refreshState();
            }
        });
    }
}
exports.Rack = Rack;
