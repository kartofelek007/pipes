import {Page} from "./page-class";
import levels from "./levels";

export class LevelSelect extends Page {
    constructor(opts) {
        super();
        this.levelUnlocked = [0]; //levele odblokowane

        this.render();
        this.hide();
        this.options = {
            ...{
                onLevelSelect: function(nr) {
                }
            },
            ...opts
        }
    }

    render() {
        this.DOM.div = document.createElement("div");
        this.DOM.div.classList.add("level-select");
        this.DOM.div.innerHTML = `
            <h2 class="level-select-title">
                Wybierz level
            </h2>
            <div class="level-select-buttons"></div>
        `;
        this.DOM.buttonsCnt = this.DOM.div.querySelector(".level-select-buttons");
        this.renderButtons();
        document.body.append(this.DOM.div);
    }

    renderButtons() {
        this.DOM.buttonsCnt.innerHTML = "";
        const fragment = new DocumentFragment();
        levels.forEach((level, i) => {
            const button = document.createElement("button");
            button.classList.add("level-select-button");
            button.disabled = !this.levelUnlocked.includes(i);
            button.innerHTML = `Poziom ${i + 1}`;
            fragment.append(button);
        });
        this.DOM.buttonsCnt.append(fragment);
        this.bindEvents();
    }

    show() {
        this.DOM.div.style.display = "flex";
    }

    hide() {
        this.DOM.div.style.display = "none";
    }

    unlockLevel(levelNr) {
        if (!this.levelUnlocked.includes(levelNr)) {
            this.levelUnlocked.push(levelNr);
            this.renderButtons();
            return true;
        }
        return false;
    }

    bindEvents() {
        const buttons = this.DOM.div.querySelectorAll(".level-select-button");
        buttons.forEach((btn, i) => {
            btn.addEventListener("click", e => {
                this.hide();
                this.options.onLevelSelect(i);
            })
        })
    }
}