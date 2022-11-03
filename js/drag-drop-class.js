import { EventObserver } from "./eventObserver";
export class DragDrop {
    constructor(dragElement, dropAreas) {
        Object.defineProperty(this, "_element", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_dropAreas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_areaFrom", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_areaDrop", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "signals", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._element = dragElement;
        this._dropAreas = [...dropAreas];
        this._areaFrom = null;
        this._areaDrop = null;
        this.signals = {
            dragStart: new EventObserver(),
            dragEnd: new EventObserver(),
            dragEnter: new EventObserver(),
            dragLeave: new EventObserver(),
            dragDrop: new EventObserver(),
        };
        this.dragStart = this.dragStart.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
        this.dragOver = this.dragOver.bind(this);
        this.dragEnter = this.dragEnter.bind(this);
        this.dragLeave = this.dragLeave.bind(this);
        this.dragDrop = this.dragDrop.bind(this);
    }
    dragStart(e) {
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move";
        }
        if (e.target) {
            const target = e.target;
            target.classList.add('dragged');
            this._areaFrom = target.parentElement;
        }
        this._areaDrop = null;
        document.addEventListener('dragover', this.dragOver);
        document.addEventListener('dragenter', this.dragEnter);
        document.addEventListener('dragleave', this.dragLeave);
        document.addEventListener('drop', this.dragDrop);
        const data = {
            originalEvent: e,
            dragElement: this._element,
            dropAreas: this._dropAreas
        };
        this.signals.dragStart.emit(data);
    }
    dragEnd(e) {
        document.removeEventListener('dragover', this.dragOver);
        document.removeEventListener('dragenter', this.dragEnter);
        document.removeEventListener('dragleave', this.dragLeave);
        document.removeEventListener('drop', this.dragDrop);
        const data = {
            originalEvent: e,
            dragElement: this._element,
            areaDrop: this._areaDrop,
            areaFrom: this._areaFrom
        };
        this.signals.dragEnd.emit(data);
    }
    dragOver(e) {
        e.preventDefault();
    }
    dragEnter(e) {
        e.preventDefault();
        const area = [...this._dropAreas].find(area => area === e.target);
        if (!area)
            return;
        const data = {
            originalEvent: e,
            dragElement: this._element,
            areaEnter: area,
            areaFrom: this._areaFrom
        };
        this.signals.dragEnter.emit(data);
    }
    dragLeave(e) {
        const area = [...this._dropAreas].find(area => area === e.target);
        if (!area)
            return;
        const data = {
            originalEvent: e,
            dragElement: this._element,
            areaLeave: area,
            areaFrom: this._areaFrom
        };
        this.signals.dragLeave.emit(data);
    }
    dragDrop(e) {
        const area = [...this._dropAreas].find(area => area === e.target);
        if (area) {
            this._areaDrop = area;
        }
        const data = {
            originalEvent: e,
            dragElement: this._element,
            areaFrom: this._areaFrom,
            areaDrop: this._areaDrop
        };
        this.signals.dragDrop.emit(data);
    }
    bindEvents() {
        if (this._element) {
            this._element.addEventListener('dragstart', this.dragStart);
            this._element.addEventListener('dragend', this.dragEnd);
        }
    }
    unbindEvents() {
        if (this._element) {
            this._element.removeEventListener('dragstart', this.dragStart);
            this._element.removeEventListener('dragend', this.dragEnd);
        }
    }
}
