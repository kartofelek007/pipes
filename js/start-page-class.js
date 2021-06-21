import {Page} from "./page-class";
import EventObserver from "./eventObserver";

export class StartPage extends Page {
    constructor() {
        super();
        this.signals = {
            onClick : new EventObserver()
        }
        this.clickFn = function() {
            this.signals.onClick.emit(true);
        }.bind(this);
        this.render();
        this.bindEvents();
    }

    render() {
        this.DOM.div = document.createElement("div");
        this.DOM.div.classList.add("start-screen");
        this.DOM.div.innerHTML = `
            <h2 class="start-screen-title">
                Rurki
            </h2>  
            <p class="start-screen-text">
                kliknij aby kontynuować...
            </p>
        `;
        document.body.append(this.DOM.div);
    }

    bindEvents() {
        document.addEventListener("click", this.clickFn, {once : true})
    }

    show() {
        this.DOM.div.style.display = "flex";
    }

    hide() {
        this.DOM.div.style.display = "none";
    }

    destructor() {
        document.removeEventListener("click", this.clickFn);
        this.DOM.div.remove();
    }
}