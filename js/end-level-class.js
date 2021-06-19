import {Page} from "./page-class";
import levels from "./levels";

export class EndLevelPopup extends Page {
    constructor(opts) {
        super();
        this.render();
        this.bindEvents();
        this.hide();
        this.options = {
            ...{
                onButtonClick: function(nr) {
                }
            },
            ...opts
        }
    }

    render() {
        this.div = document.createElement("div");
        this.div.classList.add("popup");
        this.div.innerHTML = `
            <div class="popup-container">
                <h2 class="popup-title">
                    level<br> complete
                </h2>
                <button class="popup-button">Next level</button>
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
            this.options.onButtonClick();
        })
    }
}