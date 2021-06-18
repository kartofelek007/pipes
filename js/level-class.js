import Pipe from "./pipe-class.js";
import levels from "./levels.js";
import {tileTypes, typesMustActive, typesWithPointBottom, typesWithPointLeft, typesWithPointRight, typesWithPointTop} from "./tile-types.js";

const cnt = document.querySelector('.canvas');
const movesEl = document.querySelector(".moves");
const dragPipesCnt = document.querySelector('.parts-cnt');
const trash = document.querySelector('.trash');

export default class Level {
    constructor(levelNr) {
        this.moves = 0;
        this.startTime = new Date();
        this.levelPattern = levels[levelNr].pattern.flat(Infinity);
        this.missedPart = levels[levelNr]?.missed;
        this.rowCount = 0; //liczba elementow w rzędzie
        this.colCount = 0; //liczba elementow w kolumnie
        this.level = this.parseLevelText();
        this.startPoint = null; //tylko 1 start
        this.endPoints = []; //ale koncówek może być kilka
        //
        this.generateMissedPart();
    }

    generateMissedPart() {
        dragPipesCnt.innerHTML = "";

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

                dragPipesCnt.append(divCnt);
            }

        }
    }

    parseLevelText() {
        const level = [];
        for (let str of this.levelPattern) {
            let row = [];
            for (let letter of str) {
                const tile = tileTypes.find(tile => tile.icon === letter);
                const pipe = new Pipe({...tile}, this.clickOnTile.bind(this));
                row.push(pipe);
            }
            level.push(row);
        }
        return level;
    }

    checkEndLevel() {
        let tilesToActive = 0;
        let tilesActive = 0;
        console.log(this.level);

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
            const endTime = new Date().getTime();
            const time = endTime - this.startTime;
            const timeText = new Date(time * 1000).toISOString().substr(11, 8)

            let consoleStyles = "background: gold; color: red; padding: 10px; font-size: 20px;"
            console.log("%cKONIEC", consoleStyles);
            console.log("%cLiczba ruchów: " + this.moves, consoleStyles);
            console.log("%cCzas ukończenia: " + timeText, consoleStyles);

            setTimeout(() => {
                const popupEl = document.querySelector("#popup");
                popupEl.style.display = "flex";
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
        cnt.innerHTML = "";
        const fragment = new DocumentFragment();

        for (let y = 0; y < this.level.length; y++) {
            for (let x = 0; x < this.level[y].length; x++) {
                const div = document.createElement("div");
                div.classList.add("pipe-cnt");
                div.dataset.x = x;
                div.dataset.y = y;
                const pipe = this.level[y][x];
                if (pipe.type === 0) {
                    div.classList.add("pipe-cnt-empty");
                } else {
                    div.append(pipe.div);
                }
                fragment.append(div);
            }
        }

        cnt.append(fragment)
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
        const strMoves = String(this.moves);
        const strLen = Math.max(2, strMoves.length);
        movesEl.innerHTML = strMoves.padStart(strLen, "0");
    }

    clickOnTile() {
        this.resetTileStatus();
        this.checkPipeConnection();
        this.checkEndLevel();
        this.increaseMoves();
    }

    createCanvas() {
        this.rowCount = this.level.length;
        this.colCount = this.level[0].length;

        cnt.innerHTML = "";
        cnt.style.gridTemplateColumns = `repeat(${this.colCount}, 1fr)`;
        cnt.style.gridTemplateRows = `repeat(${this.rowCount}, 1fr)`;

        this.drawElements();
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
            this.createCanvas();
            this.checkPipeConnection(this.startPoint.x, this.startPoint.y);
        }
    }
}