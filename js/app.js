//check - czy w danej petli zostal juz sprawdzony. uzywane po to by ktos nie zrobic zapetlonego spradzania
//active - czy dany tile pasuje i moze leciec woda
//icon - ikona z levelu
//poinst - wezwy wyjscia uzywane przy spradzaniu czy dwa klocki sie lacza
//static - czy dany klocek moze byc klikany
//type - typ klocka - uzywane przy przelaczaniu danego klocka
const tileOb = {
    check: false,
    active: false
}

const tileTypes = [
    {...tileOb, icon: " ", points: "", static: true, type: 0},
    {...tileOb, icon: "←", points: "L", static: true, type: 1},
    {...tileOb, icon: "↑", points: "T", static: true, type: 2},
    {...tileOb, icon: "→", points: "R", static: true, type: 3},
    {...tileOb, icon: "↓", points: "B", static: true, type: 4},

    {...tileOb, icon: "│", points: "TB", type: 5},
    {...tileOb, icon: "─", points: "LR", type: 6},

    {...tileOb, icon: "┘", points: "LT", type: 7},
    {...tileOb, icon: "└", points: "RT", type: 8},
    {...tileOb, icon: "┌", points: "RB", type: 9},
    {...tileOb, icon: "┐", points: "LB", type: 10},

    {...tileOb, icon: "┤", points: "LTB", type: 11},
    {...tileOb, icon: "┴", points: "LRT", type: 12},
    {...tileOb, icon: "├", points: "RTB", type: 13},
    {...tileOb, icon: "┬", points: "LRB", type: 14},

    {...tileOb, icon: "┼", points: "LRTB", static: true, type: 15},

    {...tileOb, icon: "◄", points: "L", static: true, type: 16},
    {...tileOb, icon: "▲", points: "T", static: true, type: 17},
    {...tileOb, icon: "►", points: "R", static: true, type: 18},
    {...tileOb, icon: "▼", points: "B", static: true, type: 19},

    {...tileOb, icon: "╥", points: "B", static : true, type: 20},
    {...tileOb, icon: "╡", points: "L", static : true, type: 21},
    {...tileOb, icon: "╨", points: "T", static : true, type: 22},
    {...tileOb, icon: "╞", points: "R", static : true, type: 23},

    {...tileOb, icon: "●", static : true, type: 30},
]

const typesWithPointLeft = tileTypes.filter(tile => tile.points && tile.points.includes("L")).map(tile => tile.type);
const typesWithPointRight = tileTypes.filter(tile => tile.points && tile.points.includes("R")).map(tile => tile.type);
const typesWithPointTop = tileTypes.filter(tile => tile.points && tile.points.includes("T")).map(tile => tile.type);
const typesWithPointBottom = tileTypes.filter(tile => tile.points && tile.points.includes("B")).map(tile => tile.type);
const typesMustActive = tileTypes.filter(tile => [16,17,18,19,20,21,22,23].includes(tile.type)).map(tile => tile.type);
const cnt = document.querySelector('.canvas');
const movesEl = document.querySelector(".moves");
const dragPipesCnt = document.querySelector('.parts-cnt');

class Level {
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

        this.clickOnTile = this.clickOnTile.bind(this);
        this.generateMissedPart();
    }

    generateMissedPart() {
        dragPipesCnt.innerHTML = "";

        if (this.missedPart) {
            [...this.missedPart].forEach((char, i) => {
                const ob = tileTypes.find(ob => ob.icon === char);
                const div = this.generatePipePart(ob);
                div.draggable = true;
                div.dataset.static = true;
                div.id = "pipe_" + i;
                const divCnt = document.createElement("div");
                divCnt.classList.add("parts-pipe-place");
                divCnt.append(div);
                dragPipesCnt.append(divCnt);
            })

        }
    }

    parseLevelText() {
        const level = [];
        for (let str of this.levelPattern) {
            let row = [];
            for (let letter of str) {
                for (let tile of tileTypes) {
                    if (letter === tile.icon) {
                        row.push({...tile});
                    }
                }
            }
            level.push(row);
        }
        return level;
    }

    drawActiveTiles() {
        const divs = document.querySelectorAll(".canvas .pipe-cnt");
        for (let y = 0; y < this.level.length; y++) {
            for (let x = 0; x < this.level[y].length; x++) {
                if (divs[y * this.colCount + x].firstElementChild) {
                    divs[y * this.colCount + x].classList.remove("pipe-active");
                    if (this.level[y][x].active) divs[y * this.colCount + x].classList.add("pipe-active");
                }
            }
        }
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
            //cnt.querySelectorAll(".canvas .pipe").forEach(el => el.removeEventListener("click", this.clickOnTile));
            cnt.removeEventListener("click", this.clickOnTile);

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

    changePipe(x, y, div) {
        let type = this.level[y][x].type;

        if (type >= 1 && type <= 4) {
            type++;
            if (type > 4) {
                type = 1;
            }
        }
        if (type >= 5 && type <= 6) {
            type++;
            if (type > 6) {
                type = 5;
            }
        }
        if (type >= 7 && type <= 10) {
            type++;
            if (type > 10) {
                type = 7;
            }
        }
        if (type >= 11 && type <= 14) {
            type++;
            if (type > 14) {
                type = 11;
            }
        }

        div.dataset.type = type;
        this.level[y][x].type = type;
        this.level[y][x].points = tileTypes.find(tile => tile.type === type).points;
    }

    resetTileStatus() {
        for (let y = 0; y < this.level.length; y++) {
            for (let x = 0; x < this.level[y].length; x++) {
                const ob = this.level[y][x];
                ob.check = false;
                ob.active = false;
            }
        }
    }

    checkPipeConnection(x, y) {
        const ob = this.level[y][x];
        ob.check = true;
        ob.active = true;

        if (ob.points === undefined) return false;

        for (let point of ob.points) {
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

    clickOnTile(e) {
        const div = e.target.closest(".pipe");
        if (div && !div.dataset.static) {
            const rotate = parseInt(getComputedStyle(div).getPropertyValue("--rotate"));
            div.style.setProperty("--rotate", `${rotate + 90}deg`)

            this.moves++;
            const strMoves = String(this.moves);
            const strLen = Math.max(2, strMoves.length);
            movesEl.innerHTML = strMoves.padStart(strLen, "0");

            this.changePipe(div.parentElement.dataset.x, div.parentElement.dataset.y, div);
            this.resetTileStatus();
            this.checkPipeConnection(this.startPoint.x, this.startPoint.y);

            div.addEventListener("transitionend", e => {
                this.drawActiveTiles();
                this.checkEndLevel();
            }, {once: true})
        }
    }

    generatePipePart(ob) {
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
        if (ob.active) {
            div.classList.add("pipe-active");
        }
        if (ob.static) {
            div.dataset.static = true;
        }
        div.dataset.type = ob.type;
        div.active = true;
        return div;
    }

    createCanvas() {
        this.rowCount = this.level.length;
        this.colCount = this.level[0].length;

        cnt.innerHTML = "";
        cnt.style.gridTemplateColumns = `repeat(${this.colCount}, 1fr)`;
        cnt.style.gridTemplateRows = `repeat(${this.rowCount}, 1fr)`;

        for (let y = 0; y < this.level.length; y++) {
            for (let x = 0; x < this.level[y].length; x++) {
                const ob = this.level[y][x];

                const divCnt = document.createElement("div");
                divCnt.classList.add("pipe-cnt");

                if (ob.type !== 0) {
                    const div = this.generatePipePart(ob);
                    divCnt.append(div);
                } else {
                    divCnt.classList.add("pipe-cnt-empty");
                }

                divCnt.dataset.x = x;
                divCnt.dataset.y = y;
                cnt.append(divCnt);
            }
        }

        cnt.addEventListener("click", this.clickOnTile)
    }

    init() {
        //find start and end
        for (let y = 0; y < this.level.length; y++) {
            for (let x = 0; x < this.level[y].length; x++) {
                const ob = this.level[y][x];
                if ("◄▲►▼".includes(ob.icon)) {
                    this.endPoints.push({x, y});
                }
                if ("←↑→↓".includes(ob.icon)) {
                    this.startPoint = {x, y};
                }
            }
        }

        if (!this.endPoints.length || !this.startPoint) {
            alert("Błędne dane we wzorze poziomu!");
        } else {
            this.createCanvas();
            this.checkPipeConnection(this.startPoint.x, this.startPoint.y);
            this.drawActiveTiles();
            dragInit();
        }
    }
}

let lv = 4;
const level = new Level(lv);
level.init();

const popup = document.querySelector(".popup");
const btn = document.querySelector(".popup-button");
btn.onclick = e => {
    popup.style.display = "none";
    movesEl.innerHTML = "00";
    lv++;
    if (lv > 5) lv = 0;
    const level = new Level(lv);
    level.init();
}



function dragInit() {
    const dragPipes = document.querySelectorAll('.parts-cnt .pipe');
    const dropPlaces = document.querySelectorAll('.pipe-cnt-empty');
    const trash = document.querySelector('.trash');
    console.log(dragPipes);
    console.log(dropPlaces);

// drop areas
    for (const drag of dragPipes) {
        drag.addEventListener('dragstart', dragStart);
        drag.addEventListener('dragend', dragEnd);
    }

// Loop through empty boxes and add listeners
    for (const place of dropPlaces) {
        console.log(place);
        document.addEventListener('dragover', dragOver);
        document.addEventListener('dragenter', dragEnter);
        document.addEventListener('dragleave', dragLeave);
        document.addEventListener('drop', dragDrop);
    }

// Drag Functions

    let from, to;

    function dragStart(e) {
        e.dataTransfer.setData("text", e.target.id);
        if (e.target.parentElement.classList.contains("parts-pipe-place")) {
            e.target.fromDiv = e.target.parentElement;
            console.log(e.target.fromDiv);
        }
        e.effectAllowed = "move";
        from = e.currentTarget.closest(".pipe-cnt");
        this.classList.add('dragged');
        setTimeout(() => {
            this.classList.add('invisible');
        }, 0);
    }

    function dragEnd() {
        this.classList.remove('invisible');
        this.classList.remove('dragged');
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
        if (!e.target.closest(".pipe-cnt:empty")) return;
        const el = e.target.closest(".pipe-cnt:empty");
        el.classList.add("hovered");
        el.classList.add("pipe-cnt-dragged-placed");
    }

    function dragLeave(e) {
        if (!e.target.closest(".pipe-cnt:empty")) return;
        const el = e.target.closest(".pipe-cnt:empty");
        el.classList.remove("hovered");
        el.classList.remove("pipe-cnt-dragged-placed");
    }

    function dragDrop(e) {
        if (!e.target.closest(".pipe-cnt:empty")) return;
        const el = e.target.closest(".pipe-cnt:empty");

        el.classList.remove("hovered");
        el.classList.remove("invisible", "dragged");

        const id = e.dataTransfer.getData("text");

        if (from) {
            const typeZero = tileTypes.find(tile => tile.type === 0);
            level.level[from.dataset.y][from.dataset.x] = {...typeZero};
            from.classList.remove("pipe-cnt-dragged-placed");
        }

        if (from !== to) {
            level.moves++;
            const strMoves = String(level.moves);
            const strLen = Math.max(2, strMoves.length);
            movesEl.innerHTML = strMoves.padStart(strLen, "0");
        }

        const draggedOriginal = document.querySelector("#" + id);
        draggedOriginal.classList.remove("invisible", "dragged")
        el.append(draggedOriginal);

        const pipeType = tileTypes.find(tile => tile.type === +draggedOriginal.dataset.type);
        level.level[el.dataset.y][el.dataset.x] = {...pipeType};

        level.resetTileStatus();
        level.checkPipeConnection(level.startPoint.x, level.startPoint.y);
        level.drawActiveTiles();
        level.checkEndLevel();
    }

    document.addEventListener('dragover', dragOverTrash);
    document.addEventListener('dragenter', dragEnterTrash);
    document.addEventListener('dragleave', dragLeaveTrash);
    document.addEventListener('drop', dragDropTrash);

    function dragOverTrash(e) {
    }

    function dragEnterTrash(e) {
    }

    function dragLeaveTrash(e) {
    }

    function dragDropTrash(e) {
        if (e.target === trash && from) {
            const id = e.dataTransfer.getData("text");
            const typeZero = tileTypes.find(tile => tile.type === 0);
            level.level[from.dataset.y][from.dataset.x] = {...typeZero};

            const draggedOriginal = document.querySelector("#" + id);
            draggedOriginal.fromDiv.append(draggedOriginal);

            level.moves++;
            const strMoves = String(level.moves);
            const strLen = Math.max(2, strMoves.length);
            movesEl.innerHTML = strMoves.padStart(strLen, "0");
        }
    }
}