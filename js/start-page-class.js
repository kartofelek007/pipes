import { Page } from "./page-class";
import { EventObserver } from "./eventObserver";
export class StartPage extends Page {
    constructor() {
        super();
        Object.defineProperty(this, "_DOM", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "signals", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._DOM = {
            div: document.createElement("div")
        };
        this.signals = {
            onClick: new EventObserver()
        };
        this._render();
        this._bindEvents();
    }
    _clickFn() {
        this.signals.onClick.emit(true);
    }
    _render() {
        this._DOM.div = document.createElement("div");
        this._DOM.div.classList.add("start-screen");
        this._DOM.div.innerHTML = `
            <h2 class="start-screen-title">
                Rurki
            </h2>
            <p class="start-screen-text">
                kliknij aby kontynuować...
            </p>
        `;
        document.body.append(this._DOM.div);
    }
    _bindEvents() {
        this._clickFn = this._clickFn.bind(this);
        document.addEventListener("click", this._clickFn, { once: true });
    }
    show() {
        this._DOM.div.style.display = "flex";
    }
    hide() {
        this._DOM.div.style.display = "none";
    }
    destructor() {
        document.removeEventListener("click", this._clickFn);
        this._DOM.div.remove();
    }
}
