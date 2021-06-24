import EventObserver from "./eventObserver";

export default class DragDrop {
    constructor(dragElement, dropAreas) {
        this.element = dragElement;
        this.dropAreas = [...dropAreas];
        this.areaFrom = null;
        this.areaDrop = null;
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
        this.areaDrop = null;
        this.areaFrom = e.target.parentElement;
        document.addEventListener('dragover', this.dragOver);
        document.addEventListener('dragenter', this.dragEnter);
        document.addEventListener('dragleave', this.dragLeave);
        document.addEventListener('drop', this.dragDrop);

        this.signals.dragStart.emit({
            originalEvent: e,
            dragElement: this.element,
            dropAreas : this.dropAreas
        });

    }

    dragEnd(e) {
        document.removeEventListener('dragover', this.dragOver);
        document.removeEventListener('dragenter', this.dragEnter);
        document.removeEventListener('dragleave', this.dragLeave);
        document.removeEventListener('drop', this.dragDrop);

        this.signals.dragEnd.emit({
            originalEvent: e,
            dragElement: this.element,
            areaFrom: this.areaFrom,
            areaDrop: this.areaDrop
        });
    }

    dragOver(e) {
        e.preventDefault();
    }

    dragEnter(e) {
        e.preventDefault();
        const area = [...this.dropAreas].find(area => area === e.target);
        if (!area) return;
        this.signals.dragEnter.emit({
            originalEvent: e,
            dragElement: this.element,
            areaEnter: area,
            areaFrom: this.areaFrom
        });
    }

    dragLeave(e) {
        const area = [...this.dropAreas].find(area => area === e.target);
        if (!area) return;
        this.signals.dragLeave.emit({
            originalEvent: e,
            dragElement: this.element,
            areaLeave: area,
            areaFrom: this.areaFrom
        });
    }

    dragDrop(e) {
        const area = [...this.dropAreas].find(area => area === e.target);
        this.areaDrop = area || null;
        this.signals.dragDrop.emit({
            originalEvent: e,
            dragElement: this.element,
            areaFrom: this.areaFrom,
            areaDrop: this.areaDrop
        });
    }

    bindEvents() {
        this.element.addEventListener('dragstart', this.dragStart);
        this.element.addEventListener('dragend', this.dragEnd);
    }

    unbindEvents() {
        this.element.removeEventListener('dragstart', this.dragStart);
        this.element.removeEventListener('dragend', this.dragEnd);
    }
}