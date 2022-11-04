import { Page } from "./page-class";
import { EventObserver } from "./eventObserver";
export class EndLevelPopup extends Page {
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
        this.signals = {
            onButtonClick: new EventObserver(),
        };
        this._DOM = {
            div: document.createElement("div"),
            button: document.createElement("button"),
        };
        this._render();
        this._bindEvents();
        this.hide();
    }
    _render() {
        this._DOM.div = document.createElement("div");
        this._DOM.div.classList.add("popup");
        this._DOM.div.innerHTML = `
            <div class="popup-container">
                <h2 class="popup-title">
                    poziom zakończony
                </h2>
                <button class="popup-button">
                    kontynuuj
                </button>
            </div>
        `;
        this._DOM.button = this._DOM.div.querySelector(".popup-button");
        document.body.append(this._DOM.div);
    }
    _bindEvents() {
        this._DOM.button.addEventListener("click", e => {
            this.hide();
            this.signals.onButtonClick.emit(true);
        });
    }
    show() {
        this._DOM.div.style.display = "flex";
        document.body.classList.add("level-complete");
    }
    hide() {
        this._DOM.div.style.display = "none";
        document.body.classList.remove("level-complete");
    }
}
