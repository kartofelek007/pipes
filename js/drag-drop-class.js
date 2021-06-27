import EventObserver from "./eventObserver";

export default class DragDrop {
    constructor(dragElement, dropAreas) {
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
        }

        this.dragStart = this.dragStart.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
        this.dragOver = this.dragOver.bind(this);
        this.dragEnter = this.dragEnter.bind(this);
        this.dragLeave = this.dragLeave.bind(this);
        this.dragDrop = this.dragDrop.bind(this);
    }

    dragStart(e) {
        e.effectAllowed = "move";
        e.target.classList.add('dragged');
        this._areaDrop = null;
        this._areaFrom = e.target.parentElement;

        document.addEventListener('dragover', this.dragOver);
        document.addEventListener('dragenter', this.dragEnter);
        document.addEventListener('dragleave', this.dragLeave);
        document.addEventListener('drop', this.dragDrop);

        this.signals.dragStart.emit({
            originalEvent: e,
            dragElement: this._element,
            dropAreas : this._dropAreas
        });

    }

    dragEnd(e) {
        document.removeEventListener('dragover', this.dragOver);
        document.removeEventListener('dragenter', this.dragEnter);
        document.removeEventListener('dragleave', this.dragLeave);
        document.removeEventListener('drop', this.dragDrop);

        this.signals.dragEnd.emit({
            originalEvent: e,
            dragElement: this._element,
            areaFrom: this._areaFrom,
            areaDrop: this._areaDrop
        });
    }

    dragOver(e) {
        e.preventDefault();
    }

    dragEnter(e) {
        e.preventDefault();
        const area = [...this._dropAreas].find(area => area === e.target);
        if (!area) return;

        this.signals.dragEnter.emit({
            originalEvent: e,
            dragElement: this._element,
            areaEnter: area,
            areaFrom: this._areaFrom
        });
    }

    dragLeave(e) {
        const area = [...this._dropAreas].find(area => area === e.target);
        if (!area) return;

        this.signals.dragLeave.emit({
            originalEvent: e,
            dragElement: this._element,
            areaLeave: area,
            areaFrom: this._areaFrom
        });
    }

    dragDrop(e) {
        const area = [...this._dropAreas].find(area => area === e.target);
        this._areaDrop = area || null;

        this.signals.dragDrop.emit({
            originalEvent: e,
            dragElement: this._element,
            areaFrom: this._areaFrom,
            areaDrop: this._areaDrop
        });
    }

    bindEvents() {
        this._element.addEventListener('dragstart', this.dragStart);
        this._element.addEventListener('dragend', this.dragEnd);
    }

    unbindEvents() {
        this._element.removeEventListener('dragstart', this.dragStart);
        this._element.removeEventListener('dragend', this.dragEnd);
    }
}