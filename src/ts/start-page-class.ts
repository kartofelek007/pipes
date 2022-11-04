import {Page} from "./page-class";
import {EventObserver} from "./eventObserver";

type DOMType = {
    div: HTMLDivElement,
}

type SignalsType = {
    onClick: EventObserver,
}

export class StartPage extends Page {
    private _DOM: DOMType;
    public signals: SignalsType;

    constructor() {
        super();
        this._DOM = {
            div: document.createElement("div")
        };
        this.signals = {
            onClick: new EventObserver()
        }
        this._render();
        this._bindEvents();
    }

    private _clickFn(): void {
        this.signals.onClick.emit(true);
    }

    private _render(): void {
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

    private _bindEvents(): void {
        this._clickFn = this._clickFn.bind(this);
        document.addEventListener("click", this._clickFn, {once: true})
    }

    show(): void {
        this._DOM.div.style.display = "flex";
    }

    hide(): void {
        this._DOM.div.style.display = "none";
    }

    destructor(): void {
        document.removeEventListener("click", this._clickFn);
        this._DOM.div.remove();
    }
}