export default class EventObserver {
    constructor() {
        this._id = 0;
        this.subscribers = {}
    }

    on(fn) { //subskrypcja - dodawanie funkcji do tablicy
        this._id++;
        this.subscribers[this._id] = fn;
        return this._id;
    }

    off(toDelete) { //usuwanie
        if (typeof toDelete === "number" && Object.hasOwnProperty(toDelete)) {
            delete this.subscribers[toDelete];
        } else {
            for (let [key, val] of Object.entries(this.subscribers)) {
                if (val === toDelete) {
                    delete this.subscribers[key];
                }
            }
        }
    }

    emit(...param) { //wywoływanie wszystkich funkcji w tablicy
        for (let [key, val] of Object.entries(this.subscribers)) {
            val(...param);
        }
    }
}

