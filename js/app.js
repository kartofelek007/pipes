import "../scss/style.scss";
import Pipe from "./pipe-class";
import DragDrop from "./drag-drop-class";
import Level from "./level-class";
import {tileTypes} from "./tile-types";
import {LevelSelect} from "./level-select-class";
import {EndLevelPopup} from "./end-level-class";
import {Debug} from "./_debug-class";
import {StartPage} from "./start-page-class";
import levels from "./levels";

function addDebug(e) {
    if (e.key === "?") {
        const debug = new Debug();
        debug.signals.onChangeValue.on(e => {
            startLevel(e);
        });
        debug.signals.onButtonClick.on(e => {
            lastUnlockLevel = levels.length - 1;

            for (let i = 0; i <= lastUnlockLevel; i++) {
                levelSelect.unlockLevel(i);
            }
        });
        document.removeEventListener("keyup", addDebug);
    }
}

document.addEventListener("keyup", addDebug);

let level = null;
let lastUnlockLevel = 0;

function startLevel(levelNr) {
    if (level !== null) level.destructor();
    level = new Level(levelNr);
    level.signals.onLevelEnd.on(e => {
        endLevelPopup.show();
        if (lastUnlockLevel === levelNr) {
            lastUnlockLevel++;
        }
        levelSelect.unlockLevel(lastUnlockLevel);
    });
    bindDrag();
    levelSelect.hide();
}

let levelSelect = new LevelSelect();
levelSelect.hide();
levelSelect.signals.onLevelSelect.on(nr => {
    levelSelect.hide();
    startLevel(nr);
})

let startPage = new StartPage();
startPage.signals.onClick.on(e => {
    startPage.destructor();
    levelSelect.show();
})

const endLevelPopup = new EndLevelPopup();
endLevelPopup.signals.onButtonClick.on(e => {
    endLevelPopup.hide();
    levelSelect.show();
})

function bindDrag() {
    const pipes = document.querySelectorAll(".parts-cnt .pipe");
    const areas = document.querySelectorAll(".pipe-cnt-place");

    pipes.forEach(pipe => {
        const dd = new DragDrop(pipe, areas);
        dd.signals.dragStart.on(({originalEvent, dragElement}) => {
            const fromDiv = dragElement.parentElement;
            const nr = fromDiv.querySelector(".parts-pipe-nr");
            nr.innerHTML--;
            if (nr.innerHTML <= 0) {
                setTimeout(() => {
                    dragElement.classList.add('invisible');
                }, 0);
            }
        });

        dd.signals.dragEnter.on(({originalEvent, dragElement, areaEnter, areaFrom}) => {
            const {x, y} = areaEnter.dataset;
            if (level.level[y][x].type === 0) {
                areaEnter.classList.add("hovered")
            }
        });

        dd.signals.dragEnd.on(({originalEvent, dragElement, areaFrom, areaDrop}) => {
        });

        dd.signals.dragLeave.on(({originalEvent, fragElement, areaLeave, areaFrom}) => {
            const {x, y} = areaLeave.dataset;
            if (level.level[y][x].type > 1) {
                areaLeave.classList.add("pipe-cnt-place-not-empty");
            } else {
                areaLeave.classList.remove("pipe-cnt-place-not-empty");
            }

            areaLeave.classList.remove("hovered");
        });

        dd.signals.dragDrop.on(({originalEvent, dragElement, areaFrom, areaDrop}) => {
            const type = +dragElement.dataset.type;
            const partCnt = dragElement.parentElement;
            const nr = partCnt.querySelector(".parts-pipe-nr");

            if (!areaDrop) {
                nr.innerHTML++;
                dragElement.classList.remove('invisible');
                dragElement.classList.remove('dragged');
                return;
            }

            areaDrop.classList.remove("hovered");
            areaDrop.classList.add("pipe-cnt-place-not-empty");

            const {x, y} = areaDrop.dataset;
            const tileObj = {...tileTypes.find(tile => tile.type === +type)};
            const pipe = new Pipe(tileObj);
            pipe.signals.onRotateEnd.on(e => {
                level.clickOnTile();
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
        });

        dd.bindEvents();
    });

    function bindElement(element) {
        const areas = document.querySelectorAll(".pipe-cnt-place, .trash");
        const trash = document.querySelector(".trash");

        const dd = new DragDrop(element, areas);

        dd.signals.dragStart.on(({originalEvent, dragElement}) => {
            setTimeout(() => {
                dragElement.classList.add('invisible');
                document.body.append(dragElement);
            }, 0);
        });

        dd.signals.dragEnter.on(({originalEvent, dragElement, areaEnter, areaFrom}) => {
            areaEnter.classList.add("hovered")
        });

        dd.signals.dragEnd.on(({originalEvent, dragElement, areaFrom, areaDrop}) => {
            dragElement.classList.remove('invisible');
            dragElement.classList.remove('dragged');
            if (!areaDrop) {
                areaFrom.append(dragElement);
            }
        });

        dd.signals.dragLeave.on(({originalEvent, dragElement, areaLeave, areaFrom}) => {
            areaLeave.classList.remove("hovered");
            areaFrom.classList.remove("pipe-cnt-place-not-empty");
        });

        dd.signals.dragDrop.on(({originalEvent, dragElement, areaFrom, areaDrop}) => {
            if (areaDrop) {
                areaDrop.classList.remove("hovered");
                areaDrop.classList.add("pipe-cnt-place-not-empty");

                if (areaDrop === trash) {
                    //zeruje element
                    {
                        const {x, y} = areaFrom.dataset;
                        const tileObj = {...tileTypes.find(tile => tile.type === 0)}
                        const pipe = new Pipe(tileObj);
                        pipe.signals.onRotateEnd.on(e => {
                            level.clickOnTile();
                        });

                        level.level[y][x] = pipe;
                    }
                    dragElement.remove();

                    const type = elem.dataset.type;
                    const partsCnt = document.querySelectorAll(".parts-pipe-place");
                    const partCnt = [...partsCnt].find(div => div.dataset.types.split(",").includes(type));
                    const nr = partCnt.querySelector(".parts-pipe-nr");
                    nr.innerHTML++;

                    const pipeDiv = partCnt.querySelector(".pipe");
                    pipeDiv.classList.remove('invisible');
                    pipeDiv.classList.remove('dragged');

                    return;
                }


                const {x, y} = areaDrop.dataset;
                const tileType = level.level[y][x].type;

                if (areaFrom !== areaDrop && tileType === 0) {
                    //zeruje element na miejscu z ktorego wyciagam
                    {
                        const {x, y} = areaFrom.dataset;
                        const tileObj = {...tileTypes.find(tile => tile.type === 0)}
                        const pipe = new Pipe(tileObj);
                        pipe.signals.onRotateEnd.on(e => {
                            level.clickOnTile();
                        });
                        level.level[y][x] = pipe;
                    }

                    //ustawiam na miejscu na ktore wrzucam
                    const {x, y} = areaDrop.dataset;
                    const type = dragElement?.dataset.type;
                    const tileObj = {...tileTypes.find(tile => tile.type === +type)}
                    const pipe = new Pipe(tileObj);
                    pipe.signals.onRotateEnd.on(e => {
                        level.clickOnTile();
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
                    areaFrom.append(dragElement);
                    areaFrom.classList.add("pipe-cnt-place-not-empty");
                }
            } else {
                areaFrom.append(dragElement);
                areaFrom.classList.add("pipe-cnt-place-not-empty");
            }
        });

        dd.bindEvents();
    }
}

