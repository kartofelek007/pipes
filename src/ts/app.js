"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import "../scss/style.scss";
const pipe_class_1 = require("./pipe-class");
const drag_drop_class_1 = require("./drag-drop-class");
const tile_types_1 = require("./tile-types");
const level_select_class_1 = require("./level-select-class");
const end_level_class_1 = require("./end-level-class");
const level_class_1 = require("./level-class");
const _debug_class_1 = require("./_debug-class");
const start_page_class_1 = require("./start-page-class");
const levels_1 = require("./levels");
function addDebug(e) {
    if (e.key === "?") {
        const debug = new _debug_class_1.Debug();
        debug.signals.onChangeValue.on((e) => {
            startLevel(e);
        });
        debug.signals.onButtonClick.on(() => {
            lastUnlockLevel = levels_1.levels.length - 1;
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
    if (level !== null)
        level.destructor();
    level = new level_class_1.Level(levelNr);
    level.signals.onLevelEnd.on(() => {
        endLevelPopup.show();
        if (lastUnlockLevel === levelNr) {
            lastUnlockLevel++;
        }
        levelSelect.unlockLevel(lastUnlockLevel);
    });
    bindDrag();
    levelSelect.hide();
}
let levelSelect = new level_select_class_1.LevelSelect();
levelSelect.hide();
levelSelect.signals.onLevelSelect.on((nr) => {
    levelSelect.hide();
    startLevel(nr);
});
let startPage = new start_page_class_1.StartPage();
startPage.signals.onClick.on(() => {
    startPage.destructor();
    levelSelect.show();
});
const endLevelPopup = new end_level_class_1.EndLevelPopup();
endLevelPopup.signals.onButtonClick.on(() => {
    endLevelPopup.hide();
    levelSelect.show();
});
function bindDrag() {
    const pipes = document.querySelectorAll(".parts-cnt .pipe");
    const areas = document.querySelectorAll(".pipe-cnt-place");
    pipes.forEach(pipe => {
        const dd = new drag_drop_class_1.DragDrop(pipe, areas);
        dd.signals.dragStart.on((obj) => {
            const dragElement = obj.dragElement;
            const fromDiv = dragElement.parentElement;
            const nr = fromDiv.querySelector(".parts-pipe-nr");
            nr.innerHTML--;
            if (nr.innerHTML <= 0) {
                setTimeout(() => {
                    dragElement.classList.add('invisible');
                }, 0);
            }
        });
        dd.signals.dragEnter.on((obj) => {
            const areaEnter = obj.areaEnter;
            const { x, y } = areaEnter.dataset;
            if (level.level[y][x].type === 0) {
                areaEnter.classList.add("hovered");
            }
        });
        dd.signals.dragEnd.on(() => {
        });
        dd.signals.dragLeave.on((obj) => {
            const areaLeave = obj.areaLeave;
            const { x, y } = areaLeave.dataset;
            if (level.level[y][x].type > 1) {
                areaLeave.classList.add("pipe-cnt-place-not-empty");
            }
            else {
                areaLeave.classList.remove("pipe-cnt-place-not-empty");
            }
            areaLeave.classList.remove("hovered");
        });
        dd.signals.dragDrop.on((obj) => {
            const dragElement = obj.dragElement;
            const areaDrop = obj.areaDrop;
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
            const { x, y } = areaDrop.dataset;
            const tile = tile_types_1.tileTypes.find(tile => tile.type === +type);
            if (tile) {
                const tileObj = { ...tile };
                const pipe = new pipe_class_1.Pipe(tileObj);
                pipe.signals.onRotateEnd.on(() => {
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
            }
        });
        dd.bindEvents();
    });
    function bindElement(element) {
        const areas = document.querySelectorAll(".pipe-cnt-place, .trash");
        const trash = document.querySelector(".trash");
        const dd = new drag_drop_class_1.DragDrop(element, areas);
        dd.signals.dragStart.on((obj) => {
            const dragElement = obj.dragElement;
            setTimeout(() => {
                dragElement.classList.add('invisible');
                document.body.append(dragElement);
            }, 0);
        });
        dd.signals.dragEnter.on((obj) => {
            const areaEnter = obj.areaEnter;
            areaEnter.classList.add("hovered");
        });
        dd.signals.dragEnd.on((obj) => {
            const dragElement = obj.dragElement;
            const areaFrom = obj.areaFrom;
            const areaDrop = obj.areaDrop;
            dragElement.classList.remove('invisible');
            dragElement.classList.remove('dragged');
            if (!areaDrop) {
                areaFrom.append(dragElement);
            }
        });
        dd.signals.dragLeave.on((obj) => {
            const areaLeave = obj.areaLeave;
            const areaFrom = obj.areaFrom;
            areaLeave.classList.remove("hovered");
            areaFrom.classList.remove("pipe-cnt-place-not-empty");
        });
        dd.signals.dragDrop.on((obj) => {
            const dragElement = obj.dragElement;
            const areaFrom = obj.areaFrom;
            const areaDrop = obj.areaDrop;
            if (areaDrop) {
                areaDrop.classList.remove("hovered");
                areaDrop.classList.add("pipe-cnt-place-not-empty");
                if (areaDrop === trash) {
                    //zeruje element
                    {
                        const { x, y } = areaFrom.dataset;
                        const tile = tile_types_1.tileTypes.find(tile => tile.type === 0);
                        if (tile) {
                            const tileObj = { ...tile };
                            const pipe = new pipe_class_1.Pipe(tileObj);
                            pipe.signals.onRotateEnd.on(() => {
                                level.clickOnTile();
                            });
                            level.level[y][x] = pipe;
                        }
                    }
                    dragElement.remove();
                    const type = dragElement.dataset.type;
                    const partsCnt = document.querySelectorAll(".parts-pipe-place");
                    const partCnt = [...partsCnt].find((div) => div.dataset.types.split(",").includes(type));
                    if (partCnt) {
                        const nr = partCnt.querySelector(".parts-pipe-nr");
                        if (nr)
                            nr.innerHTML = `${parseInt(nr.innerHTML) + 1}`;
                        const pipeDiv = partCnt.querySelector(".pipe");
                        if (pipeDiv) {
                            pipeDiv.classList.remove('invisible');
                            pipeDiv.classList.remove('dragged');
                        }
                    }
                    return;
                }
                const { x, y } = areaDrop.dataset;
                const tileType = level.level[y][x].type;
                if (areaFrom !== areaDrop && tileType === 0) {
                    //zeruje element na miejscu z ktorego wyciagam
                    {
                        const { x, y } = areaFrom.dataset;
                        const tile = tile_types_1.tileTypes.find(tile => tile.type === 0);
                        if (tile) {
                            const tileObj = { ...tile };
                            const pipe = new pipe_class_1.Pipe(tileObj);
                            pipe.signals.onRotateEnd.on(() => {
                                level.clickOnTile();
                            });
                            level.level[y][x] = pipe;
                        }
                    }
                    //ustawiam na miejscu na ktore wrzucam
                    const { x, y } = areaDrop.dataset;
                    const type = dragElement === null || dragElement === void 0 ? void 0 : dragElement.dataset.type;
                    const tile = tile_types_1.tileTypes.find(tile => tile.type === +type);
                    if (tile) {
                        const tileObj = { ...tile };
                        const pipe = new pipe_class_1.Pipe(tileObj);
                        pipe.signals.onRotateEnd.on(() => {
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
                    }
                }
                else {
                    areaFrom.append(dragElement);
                    areaFrom.classList.add("pipe-cnt-place-not-empty");
                }
            }
            else {
                areaFrom.append(dragElement);
                areaFrom.classList.add("pipe-cnt-place-not-empty");
            }
        });
        dd.bindEvents();
    }
}
