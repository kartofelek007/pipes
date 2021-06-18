import Pipe from "./pipe-class.js";
import DragDrop from "./drag-drop-class.js";
import Level from "./level-class.js";
import {tileTypes} from "./tile-types.js";
import levels from "./levels.js";

const cnt = document.querySelector('.canvas');
const movesEl = document.querySelector(".moves");
const dragPipesCnt = document.querySelector('.parts-cnt');
const trash = document.querySelector('.trash');



let lv = 0;
let level = new Level(lv);
level.init();
bindDrag();

const select = document.querySelector("select");
select.style.cssText = `
    position:absolute;
    left: 10px;
    bottom: 10px;
`;
levels.forEach((el, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.innerHTML = `level ${i}`;
    select.append(option);
})

select.onchange = function() {
    lv = select.value;
    let level = new Level(lv);
    level.init();
    bindDrag();
}


const popup = document.querySelector(".popup");
const btn = document.querySelector(".popup-button");
btn.onclick = e => {
    popup.style.display = "none";
    movesEl.innerHTML = "00";
    lv++;
    if (lv > 5) lv = 0;
    level = new Level(lv);
    level.init();
    bindDrag();
}

function bindDrag() {
    const pipes = document.querySelectorAll(".parts-cnt .pipe");
    const areas = document.querySelectorAll(".pipe-cnt-empty");
    pipes.forEach(pipe => {
        const dd = new DragDrop(pipe, areas, {
            onDragStart: (e, elem) => {
                const fromDiv = elem.parentElement;
                const nr = fromDiv.querySelector(".parts-pipe-nr");
                nr.innerHTML--;
                if (nr.innerHTML <= 0) {
                    setTimeout(() => {
                        elem.classList.add('invisible');
                    }, 0);
                }
            },

            onDragEnter: (e, elem, area, areaFrom) => {
                area.classList.add("hovered")
                area.classList.add("pipe-cnt-dragged-placed");
            },

            onDragEnd: (e, elem, areaFrom, areaDrop) => {
            },

            onDragLeave: (e, elem, area, areaFrom) => {
                area.classList.remove("hovered");
                area.classList.remove("pipe-cnt-dragged-placed");
            },

            onDragDrop: (e, elem, areaFrom, areaDrop) => {
                const type = +elem.dataset.type;
                const partCnt = elem.parentElement;
                const nr = partCnt.querySelector(".parts-pipe-nr");

                if (!areaDrop) {
                    nr.innerHTML++;
                    elem.classList.remove('invisible');
                    elem.classList.remove('dragged');
                    return;
                }

                areaDrop.classList.remove("hovered");
                areaDrop.classList.remove("pipe-cnt-dragged-placed");

                const {x, y} = areaDrop.dataset;
                const tile = tileTypes.find(tile => tile.type === +type);
                const pipe = new Pipe({...tile}, level.clickOnTile.bind(level));
                level.level[y][x] = pipe;
                pipe.draggable = true;
                areaDrop.append(pipe.div);
                level.increaseMoves();
                level.resetTileStatus();
                level.checkPipeConnection();
                level.checkEndLevel();
                bindElement(pipe.div);
            }
        });

        dd.bindEvents();
    });

    function bindElement(element) {
        const areas = document.querySelectorAll(".pipe-cnt-empty, .trash");
        const dd = new DragDrop(element, areas, {
            onDragStart: (e, elem,) => {
                setTimeout(() => {
                    elem.classList.add('invisible');
                    document.body.append(elem);
                }, 0);
            },

            onDragEnter: (e, elem, area, areaFrom) => {
                area.classList.add("hovered")
                area.classList.add("pipe-cnt-dragged-placed");
            },

            onDragEnd: (e, elem, areaFrom, areaDrop) => {
                elem.classList.remove('invisible');
                elem.classList.remove('dragged');
            },

            onDragLeave: (e, elem, area, areaFrom) => {
                area.classList.remove("hovered");
                area.classList.remove("pipe-cnt-dragged-placed");
            },

            onDragDrop: (e, elem, areaFrom, areaDrop) => {
                if (areaDrop) {
                    areaDrop.classList.remove("hovered");
                    areaDrop.classList.remove("pipe-cnt-dragged-placed");

                    if (areaDrop === trash) {
                        //zeruje element
                        {
                            const {x, y} = areaFrom.dataset;
                            level.level[y][x] = new Pipe({...tileTypes.find(tile => tile.type === 0)});
                        }
                        elem.remove();

                        const type = elem.dataset.type;
                        const partsCnt = document.querySelectorAll(".parts-pipe-place");
                        const partCnt = [...partsCnt].find(div => div.dataset.types.split(",").includes(type));
                        console.log(partCnt);
                        const nr = partCnt.querySelector(".parts-pipe-nr");
                        nr.innerHTML++;

                        const pipeDiv = partCnt.querySelector(".pipe");
                        pipeDiv.classList.remove('invisible');
                        pipeDiv.classList.remove('dragged');
                    } else {
                        console.log(areaDrop.querySelector(".pipe"));
                        if (areaFrom !== areaDrop && !areaDrop.querySelector(".pipe")) {
                            //zeruje element
                            {
                                const {x, y} = areaFrom.dataset;
                                level.level[y][x] = new Pipe({...tileTypes.find(tile => tile.type === 0)});
                            }

                            const {x, y} = areaDrop.dataset;
                            const type = elem.dataset.type;
                            const pipe = new Pipe({...tileTypes.find(tile => tile.type === +type)}, level.clickOnTile.bind(level));
                            level.level[y][x] = pipe;
                            level.increaseMoves();
                            areaDrop.append(pipe.div);
                            pipe.draggable = true;
                            bindElement(pipe.div);
                            level.resetTileStatus();
                            level.checkPipeConnection();
                            level.checkEndLevel();
                        } else {
                            areaFrom.append(elem);
                        }
                    }
                } else {
                    areaFrom.append(elem);
                }
            }
        });
        dd.bindEvents();
    }
}

