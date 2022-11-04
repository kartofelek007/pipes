import {Page} from "./page-class";
import {EventObserver} from "./eventObserver";

type DOMType = {
    div: HTMLDivElement,
    button: HTMLButtonElement
}

type SignalsType = {
    onButtonClick: EventObserver,
}

export class EndLevelPopup extends Page {
    private _DOM: DOMType
    public signals: SignalsType

    constructor() {
        super();
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

    private _render(): void {
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
        this._DOM.button = this._DOM.div.querySelector(".popup-button") as HTMLButtonElement;
        document.body.append(this._DOM.div);
    }

    private _bindEvents(): void {
        this._DOM.button.addEventListener("click", e => {
            this.hide();
            this.signals.onButtonClick.emit(true);
        })
    }

    show(): void {
        this._DOM.div.style.display = "flex";
        document.body.classList.add("level-complete");
    }

    hide(): void {
        this._DOM.div.style.display = "none";
        document.body.classList.remove("level-complete");
    }
}