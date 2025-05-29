export default class LocalStorageWatcher {
    constructor(callback, checkInterval = 1000) {
        this.callback = callback;
        this.checkInterval = checkInterval;
        this.lastState = this.getCurrentState();
        this.init();
    }

    init() {
        // Detect changes in localStorage across different tabs/windows
        window.addEventListener('storage', (event) => this.handleStorageEvent(event));
        // Detect changes in localStorage within the same tab/window
        this.startPolling();
    }

    getCurrentState() {
        return JSON.stringify(localStorage);
    }

    handleStorageEvent(event) {
        if (this.callback && typeof this.callback === 'function') {
            this.callback(event);
        }
    }

    startPolling() {
        this.pollingInterval = setInterval(() => {
            const currentState = this.getCurrentState();
            if (currentState !== this.lastState) {
                this.lastState = currentState;
                this.handleStorageEvent(new Event('storage'));
            }
        }, this.checkInterval);
    }

    stopPolling() {
        clearInterval(this.pollingInterval);
    }
}