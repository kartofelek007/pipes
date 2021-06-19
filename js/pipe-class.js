import {tileTypes} from "./tile-types";

export default class Pipe {
    constructor({icon, type, inactive = false, points, active}, animationEndFn) {
        this.points = points;
        this.check = false;
        this._icon = icon;
        this._type = type;
        this._active = active;
        this._inactive = inactive;
        this._draggable = false;
        this._animationEndFn = animationEndFn;
        this._div = Pipe.generateHTML(this._active, this._inactive, this._type);

        if (this._active) {
            this._div.classList.add("pipe-active");
        }
        if (this._inactive) {
            this._div.dataset.inactive = true;
        }
        this._div.dataset.type = this._type;

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
        this._div.dataset.type = this._type;
    }

    clickOnTile(e) {
        if (!this._inactive) {
            const rotate = parseInt(getComputedStyle(this._div).getPropertyValue("--rotate"));
            this._div.style.setProperty("--rotate", `${rotate + 90}deg`)

            this.changePipe();

            this._div.addEventListener("transitionend", e => {
                this._animationEndFn();
            })
        }
    }

    static generateHTML(active, inactive, type) {
        const div = document.createElement("div");
        div.innerHTML = `
            <div class="pipe-inside">
                <div class="pipe-active-textures">
                    <div class="pipe-active-texture1"></div>
                    <div class="pipe-active-texture2"></div>
                    <div class="pipe-active-texture3"></div>
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
            console.log(this._div);
            this._div.classList.add("pipe-active");
        } else {
            this._div.classList.remove("pipe-active");
        }
    }

    get active() {
        return this._active;
    }

    get div() {
        return this._div;
    }

    set inactive(isInactive) {
        this._div.dataset.inactive = isInactive;
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
        this._div.draggable = isDrag;
        this._draggable = isDrag;
    }

    get draggable() {
        return this._draggable;
    }

    bindEvents() {
        this.clickOnTile = this.clickOnTile.bind(this);
        this._div.addEventListener("click", this.clickOnTile);
    }

    unbindEvents() {
        this._div.removeEventListener("click", this.clickOnTile);
    }
}