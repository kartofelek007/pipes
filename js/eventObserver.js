"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventObserver {
    constructor() {
        this._id = 0;
        this.subscribers = {};
    }
    on(fn) {
        this._id++;
        const index = `${this._id}`;
        this.subscribers[index] = fn;
        return this._id;
    }
    off(toDelete) {
        for (let [key, val] of Object.entries(this.subscribers)) {
            if (val === toDelete) {
                delete this.subscribers[key];
            }
        }
    }
    emit(...param) {
        for (let [key, val] of Object.entries(this.subscribers)) {
            val(...param);
        }
    }
}
exports.default = EventObserver;
