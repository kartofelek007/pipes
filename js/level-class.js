import Pipe from "./pipe-class";
import levels from "./levels";
import {tileTypes, typesMustActive, typesWithPointBottom, typesWithPointLeft, typesWithPointRight, typesWithPointTop} from "./tile-types";
import {Page} from "./page-class";
import EventObserver from "./eventObserver";

export default class Level extends Page {
    constructor(levelNr) {
        super();
        this.signals = {
            onMove : new EventObserver(),
            onLevelStart : new EventObserver(),
            onLevelEnd : new EventObserver(),
        };
        this.moves = 0;
        this._levelEnd = false; //zmienna przelacznik, by sie spradzanie nie odpalalo kilka razy
        this.startTime = null; //czas gry
        this.levelPattern = levels[levelNr].pattern.flat(Infinity);
        this.missedPart = levels[levelNr]?.missed;
        this.rowCount = 0;
        this.colCount = 0;
        this.level = this.parseLevelText();
        this.rowCount = this.level.length;
        this.colCount = this.level[0].length;
        this.startPoint = null; //początek levelu może być tylko jeden
        this.endPoints = []; //końcówek levelu może być wiele - raczej nie używane, bo i tak spradzam pola z typesMustActive
        this.init();
    }

    generateMissedPipes() {
        this.DOM.parts.innerHTML = "";

        if (this.missedPart) {
            this.missed = {};
            [...this.missedPart].forEach(char => {
                if (this.missed[char] === undefined) this.missed[char] = 0;
                this.missed[char]++;
            });

            for (let [key, val] of Object.entries(this.missed)) {
                const ob = tileTypes.find(ob => ob.icon === key);
                const div = Pipe.generateHTML(ob.active, ob.inactive, ob.type);
                div.draggable = true;
                div.inactive = true;

                const divCnt = document.createElement("div");
                divCnt.classList.add("parts-pipe-place");
                divCnt.dataset.type = ob.type;
                divCnt.dataset.types = ob.types;
                divCnt.append(div);

                const divCntNr = document.createElement("div");
                divCntNr.classList.add("parts-pipe-nr");
                divCntNr.innerHTML = val;
                divCnt.append(divCntNr);

                this.DOM.parts.append(divCnt);
            }
        }
    }

    showMoves() {
        this.DOM.moves.innerHTML = `liczba ruchów: ${this.moves}`;
    }

    render() {
        this.DOM.div = document.createElement("div");
        this.DOM.div.classList.add("level");
        this.DOM.div.innerHTML = `
            <div class="moves">liczba ruchów: 00</div>
            <div class="canvas-cnt">
                <div class="canvas"></div>
            </div>
            <div class="parts-cnt"></div>
            <div class="trash">
                <span>trash</span>
            </div>
        `;
        this.DOM.moves = this.DOM.div.querySelector(".moves");
        this.DOM.canvas = this.DOM.div.querySelector(".canvas");
        this.DOM.parts = this.DOM.div.querySelector(".parts-cnt");
        this.DOM.trash = this.DOM.div.querySelector(".trash");

        this.DOM.canvas.style.gridTemplateColumns = `repeat(${this.colCount}, 1fr)`;
        this.DOM.canvas.style.gridTemplateRows = `repeat(${this.rowCount}, 1fr)`;

        document.body.append(this.DOM.div);
        this.drawElements();
    }

    parseLevelText() {
        const level = [];
        let y = 0;
        for (let str of this.levelPattern) {
            let row = [];
            let x = 0;
            for (let letter of str) {
                const tile = tileTypes.find(tile => tile.icon === letter);
                const pipe = new Pipe({...tile});
                pipe.signals.onRotateEnd.on(e => {
                    this.clickOnTile();
                });
                row.push(pipe);
                x++;
            }
            y++;
            level.push(row);
        }
        return level;
    }

    getEndTime() {
        const endTime = new Date().getTime();

        let delta = Math.abs(endTime - this.startTime) / 1000;

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

    checkEndLevel() {
        let tilesToActive = 0;
        let tilesActive = 0;

        for (let y = 0; y < this.level.length; y++) {
            for (let x = 0; x < this.level[y].length; x++) {
                const tileToCheck = this.level[y][x];
                if (typesMustActive.includes(tileToCheck.type)) {
                    tilesToActive++;
                    if (tileToCheck.active) tilesActive++;
                }
            }
        }

        if (tilesActive >= tilesToActive) {
            this._levelEnd = true;

            const {days, hours, minutes, seconds} = this.getEndTime();

            console.log({
                days, hours, minutes, seconds
            });

            console.log("%cKONIEC", "background: gold; color: red;");

            setTimeout(() => {
                this.signals.onLevelEnd.emit({
                    moves : this.moves,
                    timeEnd : {days, hours, minutes, seconds}
                })
            }, 1000)
        }
    }

    resetTileStatus() {
        for (let y = 0; y < this.level.length; y++) {
            for (let x = 0; x < this.level[y].length; x++) {
                const pipe = this.level[y][x];
                pipe.check = false;
                pipe.active = false;
            }
        }
    }

    drawElements() {
        this.DOM.canvas.innerHTML = "";
        const fragment = new DocumentFragment();

        for (let y = 0; y < this.level.length; y++) {
            for (let x = 0; x < this.level[y].length; x++) {
                const divCnt = document.createElement("div");
                divCnt.classList.add("pipe-cnt");
                divCnt.dataset.x = x;
                divCnt.dataset.y = y;
                const pipe = this.level[y][x];
                if (pipe.type === 0) {
                    divCnt.classList.add("pipe-cnt-place");
                } else {
                    divCnt.append(pipe.div);
                }
                fragment.append(divCnt);
            }
        }
        this.DOM.canvas.append(fragment)
    }

    checkPipeConnection(x = null, y = null) {
        x = (x === null) ? this.startPoint.x : x;
        y = (y === null) ? this.startPoint.y : y;

        const pipe = this.level[y][x];
        pipe.check = true;
        pipe.active = true;

        if (pipe.points === undefined) return false;

        for (let point of pipe.points) {
            //w lewo
            if (point === "L" && x > 0) {
                const neighbor = this.level[y][x - 1];
                if (!neighbor.check && typesWithPointRight.includes(neighbor.type)) {
                    this.checkPipeConnection(x - 1, y);
                }
            }
            //w prawo
            if (point === "R" && x < this.colCount - 1) {
                const neighbor = this.level[y][x + 1];
                if (!neighbor.check && typesWithPointLeft.includes(neighbor.type)) {
                    this.checkPipeConnection(x + 1, y);
                }
            }
            //w gore
            if (point === "T" && y > 0) {
                const neighbor = this.level[y - 1][x];
                if (!neighbor.check && typesWithPointBottom.includes(neighbor.type)) {
                    this.checkPipeConnection(x, y - 1);
                }
            }
            //dol
            if (point === "B" && y < this.rowCount - 1) {
                const neighbor = this.level[y + 1][x];
                if (!neighbor.check && typesWithPointTop.includes(neighbor.type)) {
                    this.checkPipeConnection(x, y + 1);
                }
            }
        }
    }

    increaseMoves() {
        this.moves++;
        this.showMoves();
        this.signals.onMove.emit(this.moves);
    }

    clickOnTile() {
        this.resetTileStatus();
        this.checkPipeConnection();
        if (!this._levelEnd) {
            this.checkEndLevel();
        }
        this.increaseMoves();
    }

    init() {
        //find start and end
        for (let y = 0; y < this.level.length; y++) {
            for (let x = 0; x < this.level[y].length; x++) {
                const pipe = this.level[y][x];
                if ("◄▲►▼".includes(pipe.icon)) {
                    this.endPoints.push({x, y});
                }
                if ("←↑→↓".includes(pipe.icon)) {
                    this.startPoint = {x, y};
                }
            }
        }

        if (!this.endPoints.length || !this.startPoint) {
            alert("Błędne dane we wzorze poziomu!");
        } else {
            this.render();
            this.generateMissedPipes();
            this.checkPipeConnection();
            this.startTime = new Date();
            this.signals.onLevelStart.emit(true);
        }
    }

    destructor() {
        this.DOM.div.remove();
    }
}