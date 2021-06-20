import levels from "./levels";
import EventObserver from "./eventObserver";

export class Debug {
    constructor(props) {
        this.signals = {
            changeValue : new EventObserver()
        }
        this.render();
    }

    render() {
        this.select = document.createElement("select")
        this.select.style.cssText = `
            position:absolute;
            left: 10px;
            bottom: 10px;
            z-index: 1000
        `;

        levels.forEach((el, i) => {
            const option = document.createElement("option");
            option.value = i;
            option.innerHTML = `level ${i}`;
            this.select.append(option);
        })

        this.select.onchange = function() {
            this.signals.changeValue.emit(true);
        }

        document.body.append(this.select);
    }

}