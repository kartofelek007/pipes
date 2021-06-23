import {Page} from "./page-class";
import levels from "./levels";
import EventObserver from "./eventObserver";

export class EndLevelPopup extends Page {
    constructor(opts) {
        super();
        this.signals = {
            onButtonClick : new EventObserver(),
        };
        this.render();
        this.bindEvents();
        this.hide();
    }

    render() {
        this.div = document.createElement("div");
        this.div.classList.add("popup");
        this.div.innerHTML = `
            <div class="popup-container">
                <h2 class="popup-title">
                    poziom zakończony
                </h2>
                <button class="popup-button">
                    kontynuuj
                </button>
            </div>        
        `;
        this.button = this.div.querySelector(".popup-button");
        document.body.append(this.div);
    }

    show() {
        this.div.style.display = "flex";
        document.body.classList.add("level-complete");
    }

    hide() {
        this.div.style.display = "none";
        document.body.classList.remove("level-complete");
    }

    bindEvents() {
        this.button.addEventListener("click", e => {
            this.hide();
            this.signals.onButtonClick.emit(true);
        })
    }
}