import "../scss/style.scss";
import Pipe from "./pipe-class";
import DragDrop from "./drag-drop-class";
import Level from "./level-class";
import {tileTypes} from "./tile-types";
import {LevelSelect} from "./level-select-class";
import {EndLevelPopup} from "./end-level-class";
import * as debug from "./_debug";

let lastUnlockLevel = 0;
let level = null;

function startLevel(levelNr) {
    level = new Level(levelNr, {
        onEnd: e => {
            endLevelPopup.show();
            if (lastUnlockLevel === levelNr) {
                lastUnlockLevel++;
            }
            levelSelect.unlockLevel(lastUnlockLevel);
        }
    });
    bindDrag();
}

let levelSelect = new LevelSelect({
    onLevelSelect: nr => {
        levelSelect.hide();
        startLevel(nr);
    }
});
levelSelect.show();


const endLevelPopup = new EndLevelPopup({
    onButtonClick: e => {
        endLevelPopup.hide();
        levelSelect.show();
    }
});


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
            },

            onDragEnd: (e, elem, areaFrom, areaDrop) => {
            },

            onDragLeave: (e, elem, area, areaFrom) => {
                area.classList.remove("hovered");
                area.classList.remove("pipe-cnt-placed");
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
                areaDrop.classList.add("pipe-cnt-placed");

                const {x, y} = areaDrop.dataset;
                const tileObj = {...tileTypes.find(tile => tile.type === +type)};
                const pipe = new Pipe(tileObj, {
                    onRotateEnd : level.clickOnTile.bind(level)
                });
                level.level[y][x] = pipe;
                areaDrop.append(pipe.div);
                level.increaseMoves();
                level.resetTileStatus();
                level.checkPipeConnection();
                level.checkEndLevel();
                pipe.draggable = true;

                //czy polozone juz rurki powinno sie moc zabierac z planszy albo przestawiac
                //miejscami? - dodatkowo powyzej draggable
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
            },

            onDragEnd: (e, elem, areaFrom, areaDrop) => {
                elem.classList.remove('invisible');
                elem.classList.remove('dragged');
                if (!areaDrop) {
                    areaFrom.append(elem);
                }
            },

            onDragLeave: (e, elem, area, areaFrom) => {
                area.classList.remove("hovered");
                areaFrom.classList.remove("pipe-cnt-placed");
            },

            onDragDrop: (e, elem, areaFrom, areaDrop) => {
                if (areaDrop) {
                    areaDrop.classList.remove("hovered");
                    areaDrop.classList.add("pipe-cnt-placed");

                    if (areaDrop === trash) {
                        //zeruje element
                        {
                            const {x, y} = areaFrom.dataset;
                            const typeObj = {...tileTypes.find(tile => tile.type === 0)}
                            level.level[y][x] = new Pipe(typeObj, {
                                onRotateEnd : level.clickOnTile.bind(level)
                            });
                        }
                        elem.remove();

                        const type = elem.dataset.type;
                        const partsCnt = document.querySelectorAll(".parts-pipe-place");
                        const partCnt = [...partsCnt].find(div => div.dataset.types.split(",").includes(type));
                        const nr = partCnt.querySelector(".parts-pipe-nr");
                        nr.innerHTML++;

                        const pipeDiv = partCnt.querySelector(".pipe");
                        pipeDiv.classList.remove('invisible');
                        pipeDiv.classList.remove('dragged');
                    } else {
                        if (areaFrom !== areaDrop && !areaDrop.querySelector(".pipe")) {
                            //zeruje element
                            {
                                const {x, y} = areaFrom.dataset;
                                const typeObj = {...tileTypes.find(tile => tile.type === 0)};
                                level.level[y][x] = new Pipe(typeObj, {
                                    onRotateEnd : level.clickOnTile.bind(level)
                                });
                            }

                            const {x, y} = areaDrop.dataset;
                            const type = elem.dataset.type;
                            const typeObj = {...tileTypes.find(tile => tile.type === +type)};
                            const pipe = new Pipe(typeObj, {
                                onRotateEnd : level.clickOnTile.bind(level)
                            });
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
                }
            }
        });
        dd.bindEvents();
    }
}

