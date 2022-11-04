import {Pipe} from "./pipe-class";
import {levels} from "./levels";
import {tileTypes, typesMustActive, typesWithPointBottom, typesWithPointLeft, typesWithPointRight, typesWithPointTop} from "./tile-types";
import type {TileType} from "./tile-types";
import {Page} from "./page-class";
import {EventObserver} from "./eventObserver";

type DOMType = {
    div: HTMLDivElement;
    moves: HTMLDivElement;
    canvas: HTMLCanvasElement;
    trash: HTMLDivElement;
    parts: HTMLDivElement;
}

type SignalsType = {
    onMove: EventObserver;
    onLevelStart: EventObserver;
    onLevelEnd: EventObserver;
}

type PointType = {
    x: number;
    y: number;
}

type DateTimeType = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export class Level extends Page {
    private _DOM: DOMType
    public signals: SignalsType

    private _moves: number;
    private _levelEnd: boolean; //zmienna przelacznik, by sie spradzanie nie odpalalo kilka razy
    private _startTime: number; //czas gry
    private _levelPattern: Array<string>;
    private _missedPart: string;
    private _level: Pipe[][]
    private _rowCount: number;
    private _colCount: number;
    private _startPoint: PointType; //początek levelu może być tylko jeden
    private _endPoints: Array<PointType>;

    constructor(levelNr: number) {
        super();
        this.signals = {
            onMove: new EventObserver(),
            onLevelStart: new EventObserver(),
            onLevelEnd: new EventObserver(),
        };
        this._DOM = {
            div: document.createElement("div"),
            moves: document.createElement("div"),
            canvas: document.createElement("canvas"),
            parts: document.createElement("div"),
            trash: document.createElement("div"),
        };
        this._moves = 0;
        this._levelEnd = false; //zmienna przelacznik, by sie spradzanie nie odpalalo kilka razy
        this._startTime = new Date().getTime(); //czas gry
        //this._levelPattern = levels[levelNr].pattern.flat(Infinity);
        const pattern: string[][] = levels[levelNr].pattern;
        this._levelPattern = ([] as string[]).concat(...pattern);
        this._missedPart = levels[levelNr]?.missed;
        this._level = this._parseLevelText();
        this._rowCount = this._level.length;
        this._colCount = this._level[0].length;
        this._startPoint = {x: 0, y: 0}; //początek levelu może być tylko jeden
        this._endPoints = []; //końcówek levelu może być wiele - raczej nie używane, bo i tak spradzam pola z typesMustActive
        this._init();
    }

    private _generateMissedPipes(): void {
        this._DOM.parts.innerHTML = "";

        if (this._missedPart) {
            const missed: any = {};

            [...this._missedPart].forEach(char => {
                if (missed[char] === undefined) missed[char] = 0;
                missed[char]++;
            });

            for (let [key, val] of Object.entries(missed)) {
                const ob = tileTypes.find(ob => ob.icon === key) as TileType;
                const div = Pipe.generateHTML(ob.active, ob.inactive, ob.type) as HTMLDivElement;
                div.draggable = true;
                div.dataset.inactive = `${true}`;

                const divCnt = document.createElement("div");
                divCnt.classList.add("parts-pipe-place");
                divCnt.dataset.type = `${ob.type}`;
                divCnt.dataset.types = `${ob.types}`;
                divCnt.append(div);

                const divCntNr = document.createElement("div") as HTMLDivElement;
                divCntNr.classList.add("parts-pipe-nr");
                divCntNr.innerHTML = `${val}`;
                divCnt.append(divCntNr);

                this._DOM.parts.append(divCnt);
            }
        }
    }

    private _showMoves(): void {
        this._DOM.moves.innerHTML = `liczba ruchów: ${this._moves}`;
    }

    private _render(): void {
        this._DOM.div = document.createElement("div");
        this._DOM.div.classList.add("level");
        this._DOM.div.innerHTML = `
            <div class="moves">liczba ruchów: 00</div>
            <div class="canvas-cnt">
                <div class="canvas"></div>
            </div>
            <div class="parts-cnt"></div>
            <div class="trash">
                <span>kosz</span>
            </div>
        `;
        this._DOM.moves = this._DOM.div.querySelector(".moves") as HTMLDivElement;
        this._DOM.canvas = this._DOM.div.querySelector(".canvas") as HTMLCanvasElement;
        this._DOM.parts = this._DOM.div.querySelector(".parts-cnt") as HTMLDivElement;
        this._DOM.trash = this._DOM.div.querySelector(".trash") as HTMLDivElement;

        this._DOM.canvas.style.gridTemplateColumns = `repeat(${this._colCount}, 1fr)`;
        this._DOM.canvas.style.gridTemplateRows = `repeat(${this._rowCount}, 1fr)`;

        document.body.append(this._DOM.div);
        this._drawElements();
    }

    private _parseLevelText(): Pipe[][] {
        const level = [];
        let y = 0;
        for (let str of this._levelPattern) {
            let row = [];
            let x = 0;
            for (let letter of str) {
                const tile: TileType | undefined = tileTypes.find(tile => tile.icon === letter);
                if (!tile) {
                    throw Error("Zły tile w strukturze levelu")
                } else {
                    const pipe = new Pipe({...tile});
                    pipe.signals.onRotateEnd.on(() => {
                        this.clickOnTile();
                    });
                    row.push(pipe);
                    x++;
                }
            }
            y++;
            level.push(row);
        }
        return level;
    }

    private _getEndTime(): DateTimeType {
        const endTime = new Date().getTime();

        let delta = Math.abs(endTime - this._startTime) / 1000;

        let days = Math.floor(delta / 86400);
        delta -= days * 86400;

        let hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        let minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        let seconds = delta % 60;  // in theory the modulus is not required

        return {
            days, hours, minutes, seconds
        };
    }

    checkEndLevel(): void {
        let tilesToActive = 0;
        let tilesActive = 0;

        for (let y = 0; y < this._level.length; y++) {
            for (let x = 0; x < this._level[y].length; x++) {
                const tileToCheck = this._level[y][x];
                if (typesMustActive.includes(tileToCheck.type)) {
                    tilesToActive++;
                    if (tileToCheck.active) tilesActive++;
                }
            }
        }

        if (tilesActive >= tilesToActive) {
            this._levelEnd = true;

            const {days, hours, minutes, seconds} = this._getEndTime();

            console.log({
                days, hours, minutes, seconds
            });

            console.log("%cKONIEC", "background: gold; color: red;");

            setTimeout(() => {
                this.signals.onLevelEnd.emit({
                    moves: this._moves,
                    timeEnd: {days, hours, minutes, seconds}
                })
            }, 1000)
        }
    }

    resetTileStatus(): void {
        for (let y = 0; y < this._level.length; y++) {
            for (let x = 0; x < this._level[y].length; x++) {
                const pipe = this._level[y][x];
                pipe.check = false;
                pipe.active = false;
            }
        }
    }

    private _drawElements(): void {
        this._DOM.canvas.innerHTML = "";
        const fragment = new DocumentFragment();

        for (let y = 0; y < this._level.length; y++) {
            for (let x = 0; x < this._level[y].length; x++) {
                const divCnt = document.createElement("div");
                divCnt.classList.add("pipe-cnt");
                divCnt.dataset.x = `${x}`;
                divCnt.dataset.y = `${y}`;
                const pipe = this._level[y][x];
                if (pipe.type === 0) {
                    divCnt.classList.add("pipe-cnt-place");
                } else {
                    divCnt.append(pipe.div);
                }
                fragment.append(divCnt);
            }
        }
        this._DOM.canvas.append(fragment)
    }

    checkPipeConnection(x: number = -1, y: number = -1): boolean {
        if (y < 0) y = this._startPoint.y
        if (x < 0) x = this._startPoint.x

        const pipe = this._level[y][x];
        pipe.check = true;
        pipe.active = true;

        if (pipe.points === undefined) return false;

        for (let point of pipe.points) {
            //w lewo
            if (point === "L" && x > 0) {
                const neighbor = this._level[y][x - 1];
                if (!neighbor.check && typesWithPointRight.includes(neighbor.type)) {
                    this.checkPipeConnection(x - 1, y);
                }
            }
            //w prawo
            if (point === "R" && x < this._colCount - 1) {
                const neighbor = this._level[y][x + 1];
                if (!neighbor.check && typesWithPointLeft.includes(neighbor.type)) {
                    this.checkPipeConnection(x + 1, y);
                }
            }
            //w gore
            if (point === "T" && y > 0) {
                const neighbor = this._level[y - 1][x];
                if (!neighbor.check && typesWithPointBottom.includes(neighbor.type)) {
                    this.checkPipeConnection(x, y - 1);
                }
            }
            //dol
            if (point === "B" && y < this._rowCount - 1) {
                const neighbor = this._level[y + 1][x];
                if (!neighbor.check && typesWithPointTop.includes(neighbor.type)) {
                    this.checkPipeConnection(x, y + 1);
                }
            }
        }
        return true
    }

    increaseMoves(): void {
        this._moves++;
        this._showMoves();
        this.signals.onMove.emit(this._moves);
    }

    clickOnTile(): void {
        this.resetTileStatus();
        this.checkPipeConnection();
        if (!this._levelEnd) {
            this.checkEndLevel();
        }
        this.increaseMoves();
    }

    get level() {
        return this._level;
    }

    private _init(): void {
        //find start and end
        for (let y = 0; y < this._level.length; y++) {
            for (let x = 0; x < this._level[y].length; x++) {
                const pipe = this._level[y][x];
                if ("◄▲►▼".includes(pipe.icon)) {
                    this._endPoints.push({x, y});
                }
                if ("←↑→↓".includes(pipe.icon)) {
                    this._startPoint = {x, y};
                }
            }
        }

        if (!this._endPoints.length || !this._startPoint) {
            alert("Błędne dane we wzorze poziomu!");
        } else {
            this._render();
            this._generateMissedPipes();
            this.checkPipeConnection();
            this._startTime = new Date().getTime();
            this.signals.onLevelStart.emit(true);
        }
    }

    destructor(): void {
        this._DOM.div.remove();
    }
}
