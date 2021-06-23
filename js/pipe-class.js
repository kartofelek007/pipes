import {tileTypes} from "./tile-types";
import EventObserver from "./eventObserver";

export default class Pipe {
    constructor({icon, type, inactive = false, points, active}, opts) {
        this.signals = {
            onRotateEnd : new EventObserver()
        };
        this.points = points;
        this.check = false;
        this._icon = icon;
        this._type = type;
        this._active = active;
        this._inactive = inactive;
        this._draggable = false;
        
        this.DOM = {};
        this.DOM.div = Pipe.generateHTML(this._active, this._inactive, this._type);
        this.bindEvents();
    }

    changePipe() {
        if (this._type >= 1 && this._type <= 4) {
            this._type++;
            if (this._type > 4) {
                this._type = 1;
            }
        }
        if (this._type >= 5 && this._type <= 6) {
            this._type++;
            if (this._type > 6) {
                this._type = 5;
            }
        }
        if (this._type >= 7 && this._type <= 10) {
            this._type++;
            if (this._type > 10) {
                this._type = 7;
            }
        }
        if (this._type >= 11 && this._type <= 14) {
            this._type++;
            if (this._type > 14) {
                this._type = 11;
            }
        }

        this.points = tileTypes.find(tile => tile.type === this._type).points;
        this.DOM.div.dataset.type = this._type;
    }

    clickOnTile(e) {
        if (!this._inactive) {
            const rotate = parseInt(getComputedStyle(this.DOM.div).getPropertyValue("--rotate"));
            this.DOM.div.style.setProperty("--rotate", `${rotate + 90}deg`)

            this.changePipe();

            this.DOM.div.addEventListener("transitionend", e => {
                this.signals.onRotateEnd.emit(this.DOM.div);
            }, {once: true})
        }
    }

    static generateHTML(active, inactive, type) {
        const div = document.createElement("div");
        div.innerHTML = `
            <div class="pipe-inside">
                <div class="pipe-active-textures">
                    <div class="pipe-active-texture1"></div>
                    <div class="pipe-active-texture2"></div>
                </div>
            </div>
        `;

        div.classList.add("pipe");

        if (active) {
            div.classList.add("pipe-active");
        }
        if (inactive) {
            div.dataset.inactive = true;
        }
        div.dataset.type = type;

        return div;
    }

    set active(isActive) {
        this._active = isActive;
        if (this._active) {
            this.DOM.div.classList.add("pipe-active");
        } else {
            this.DOM.div.classList.remove("pipe-active");
        }
    }

    get active() {
        return this._active;
    }

    get div() {
        return this.DOM.div;
    }

    set inactive(isInactive) {
        this.DOM.div.dataset.inactive = isInactive;
        this._inactive = isInactive;
    }

    set icon(icon) {
        this._icon = icon;
    }

    get icon() {
        return this._icon;
    }

    get type() {
        return this._type;
    }

    get inactive() {
        return this._inactive;
    }

    set draggable(isDrag) {
        this.DOM.div.draggable = isDrag;
        this._draggable = isDrag;
    }

    get draggable() {
        return this._draggable;
    }

    bindEvents() {
        this.clickOnTile = this.clickOnTile.bind(this);
        this.DOM.div.addEventListener("click", this.clickOnTile);
    }

    unbindEvents() {
        this.DOM.div.removeEventListener("click", this.clickOnTile);
    }
}