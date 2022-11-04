type EventObserverType = {
    _id: number,
    subscribers: object
}

export class EventObserver {
    private _id: number
    public subscribers: Record<string, Function>

    constructor() {
        this._id = 0;
        this.subscribers = {}
    }

    on(fn: Function): number {
        this._id++;
        const index: string = `${this._id}`;
        this.subscribers[index] = fn;
        return this._id;
    }

    off(toDelete: Function): void {
        for (let [key, val] of Object.entries(this.subscribers)) {
            if (val === toDelete) {
                delete this.subscribers[key];
            }
        }
    }

    emit(...param: any[]): void {
        for (let [key, val] of Object.entries(this.subscribers)) {
            val(...param);
        }
    }
}

