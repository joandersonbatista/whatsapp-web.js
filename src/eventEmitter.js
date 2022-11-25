const EventEmitter = require("events");

class SingletonEventEmitter {
    static instance = null;

    eventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    static getInstance() {
        if (this.instance === null) {
            this.instance = new SingletonEventEmitter();
        }

        return this.instance;
    }

    subscribe(event, listener) {
        this.eventEmitter.on(event, listener);
    }

    unsubscribe(event, listener) {
        this.eventEmitter.removeListener(event, listener);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emit(event, args) {
        this.eventEmitter.emit(event, args);
    }

    unsubscribeToAll() {
        this.eventEmitter.removeAllListeners();
    }
}

module.exports = SingletonEventEmitter;
