import {tileTypes, TileType, TilesTypesType} from "./tile-types";
import {EventObserver} from "./eventObserver";

type DOMType = {
    div: HTMLDivElement,
}

type SignalsType = {
    onRotateEnd: EventObserver,
}

export class Pipe {
    public signals: SignalsType
    private _check: boolean
    private _icon: string
    private _type: number
    private _points: string
    private _pipeTypesGroup: Array<number>
    private _active: boolean
    private _inactive: boolean
    private _draggable: boolean
    private _DOM: DOMType

    constructor(params: TileType) {
        this.signals = {
            onRotateEnd: new EventObserver()
        };

        this._check = false;
        this._icon = params.icon;
        this._type = params.type;
        this._points = this._getPipePoints();
        this._pipeTypesGroup = this._getPipeTypesGroup();
        this._active = params.active;
        this._inactive = params.inactive;
        this._draggable = false;

        this._DOM = {
            div: Pipe.generateHTML(this._active, this._inactive, this._type)
        };
        this.bindEvents();
    }

    private _getPipeTypesGroup(): Array<number> {
        const tile: TileType | undefined = tileTypes.find(pipe => pipe.type === this._type);
        if (tile !== undefined) {
            return tile.types
        }
        return []
    }

    private _getPipePoints(): string {
        const tile: TileType | undefined = tileTypes.find(tile => tile.type === this._type);
        if (tile !== undefined) {
            return tile.points
        }
        return '';
    }

    changePipe(): void {
        const min = Math.min(...this._pipeTypesGroup);
        const max = Math.max(...this._pipeTypesGroup);

        this._type++;

        if (this._type > max) {
            this._type = min;
        }

        this._pipeTypesGroup = this._getPipeTypesGroup();
        this._points = this._getPipePoints();
        this._DOM.div.dataset.type = `${this._type}`;
    }

    private _clickOnTile(e: MouseEvent) {
        if (!this._inactive) {
            const rotate = parseInt(getComputedStyle(this._DOM.div).getPropertyValue("--rotate"));
            this._DOM.div.style.setProperty("--rotate", `${rotate + 90}deg`)

            this.changePipe();

            this._DOM.div.addEventListener("transitionend", e => {
                this.signals.onRotateEnd.emit(this._DOM.div);
            }, {once: true})
        }
    }

    static generateHTML(active: boolean, inactive: boolean, type: number) {
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
            div.dataset.inactive = `${true}`;
        }
        div.dataset.type = `${type}`;

        return div;
    }

    get check() {
        return this._check;
    }

    set check(isCheck) {
        this._check = isCheck;
    }

    get points() {
        return this._points;
    }

    set points(newPoints) {
        this._points = newPoints;
    }

    set active(isActive) {
        this._active = isActive;
        if (this._active) {
            this._DOM.div.classList.add("pipe-active");
        } else {
            this._DOM.div.classList.remove("pipe-active");
        }
    }

    get active() {
        return this._active;
    }

    get div() {
        return this._DOM.div;
    }

    set inactive(isInactive: boolean) {
        this._DOM.div.dataset.inactive = `${isInactive}`;
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
        this._DOM.div.draggable = isDrag;
        this._draggable = isDrag;
    }

    get draggable() {
        return this._draggable;
    }

    bindEvents(): void {
        this._clickOnTile = this._clickOnTile.bind(this);
        this._DOM.div.addEventListener("click", this._clickOnTile);
    }

    unbindEvents(): void {
        this._DOM.div.removeEventListener("click", this._clickOnTile);
    }
}