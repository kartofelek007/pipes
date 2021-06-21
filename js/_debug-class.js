import levels from "./levels";
import EventObserver from "./eventObserver";

export class Debug {
    constructor(props) {
        this.signals = {
            onChangeValue : new EventObserver(),
            onButtonClick : new EventObserver()
        }
        this.DOM = {};
        this.render();
    }

    render() {
        this.DOM.select = document.createElement("select")
        this.DOM.select.style.cssText = `
            position:absolute;
            left: 10px;
            bottom: 10px;
            z-index: 1000
        `;

        levels.forEach((el, i) => {
            const option = document.createElement("option");
            option.value = i;
            option.innerHTML = `level ${i+1}`;
            this.DOM.select.append(option);
        })

        this.DOM.select.onchange = () => {
            this.signals.onChangeValue.emit(+this.DOM.select.value);
        }

        this.DOM.button = document.createElement("button");
        this.DOM.button.style.cssText = `
            position: fixed;
            bottom: 35px;
            left: 10px;
            z-index: 1000;
        `
        this.DOM.button.classList.add("debug-button");
        this.DOM.button.innerHTML = "Odblokuj poziomy"
        this.DOM.button.onclick = e => {
            this.signals.onButtonClick.emit(true);
        }

        document.body.append(this.DOM.select);
        document.body.append(this.DOM.button);
    }

}