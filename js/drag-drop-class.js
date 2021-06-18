export default class DragDrop {
    constructor(dragElement, dropAreas, opts) {
        this.element = dragElement;
        this.dropAreas = [...dropAreas];
        this.areaFrom = null;
        this.areaDrop = null;

        this.options = {...{
                onDragStart : (e, drawEl, areas) => {},
                onDragEnd : (e, drawEl, areaFrom, areaDrop) => {},
                onDragEnter : (e, drawEl, areaFrom, areaDrop) => {},
                onDragLeave : (e, drawEl, areaFrom, areaDrop) => {},
                onDragDrop : (e, drawEl, areaFrom, areaDrop) => {},
            }, ...opts}

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
console.log(this.dropAreas);
        document.addEventListener('dragover', this.dragOver);
        document.addEventListener('dragenter', this.dragEnter);
        document.addEventListener('dragleave', this.dragLeave);
        document.addEventListener('drop', this.dragDrop);

        this.options.onDragStart(e, this.element, this.dropAreas);
    }

    dragEnd(e) {
        document.removeEventListener('dragover', this.dragOver);
        document.removeEventListener('dragenter', this.dragEnter);
        document.removeEventListener('dragleave', this.dragLeave);
        document.removeEventListener('drop', this.dragDrop);

        this.options.onDragEnd(e, this.element, this.areaFrom, this.areaDrop);
    }

    dragOver(e) {
        e.preventDefault();
    }

    dragEnter(e) {
        e.preventDefault();
        const area = [...this.dropAreas].find(area => area === e.target);
        if (!area) return;
        this.options.onDragEnter(e, this.element, area, this.areaFrom);
    }

    dragLeave(e) {
        const area = [...this.dropAreas].find(area => area === e.target);
        if (!area) return;
        this.options.onDragLeave(e, this.element, area, this.areaFrom);
    }

    dragDrop(e) {
        const area = [...this.dropAreas].find(area => area === e.target);
        this.areaDrop = area || null;
        this.options.onDragDrop(e, this.element, this.areaFrom, this.areaDrop);
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