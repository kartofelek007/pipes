"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debug = void 0;
const levels_1 = __importDefault(require("./levels"));
const eventObserver_1 = __importDefault(require("./eventObserver"));
class Debug {
    constructor() {
        this.signals = {
            onChangeValue: new eventObserver_1.default(),
            onButtonClick: new eventObserver_1.default()
        };
        this.DOM = {
            select: document.createElement("select"),
            button: document.createElement("button")
        };
        this.render();
    }
    render() {
        this.DOM.select = document.createElement("select");
        this.DOM.select.style.cssText = `
            position:absolute;
            left: 10px;
            bottom: 10px;
            z-index: 1000
        `;
        levels_1.default.forEach((el, i) => {
            const option = document.createElement("option");
            option.value = `${i}`;
            option.innerHTML = `level ${i + 1}`;
            this.DOM.select.append(option);
        });
        this.DOM.select.onchange = () => {
            this.signals.onChangeValue.emit(+this.DOM.select.value);
        };
        this.DOM.button = document.createElement("button");
        this.DOM.button.style.cssText = `
            position: fixed;
            bottom: 35px;
            left: 10px;
            z-index: 1000;
        `;
        this.DOM.button.classList.add("debug-button");
        this.DOM.button.innerHTML = "Odblokuj poziomy";
        this.DOM.button.onclick = () => {
            this.signals.onButtonClick.emit(true);
        };
        document.body.append(this.DOM.select);
        document.body.append(this.DOM.button);
    }
}
exports.Debug = Debug;
