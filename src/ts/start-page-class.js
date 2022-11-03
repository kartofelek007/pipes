"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartPage = void 0;
const page_class_1 = require("./page-class");
const eventObserver_1 = require("./eventObserver");
class StartPage extends page_class_1.Page {
    constructor() {
        super();
        this._DOM = {
            div: document.createElement("div")
        };
        this.signals = {
            onClick: new eventObserver_1.EventObserver()
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
exports.StartPage = StartPage;
