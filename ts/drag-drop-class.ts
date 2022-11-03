import EventObserver from "./eventObserver";

type SignalsType = {
    dragStart: EventObserver,
    dragEnd: EventObserver,
    dragEnter: EventObserver,
    dragLeave: EventObserver,
    dragDrop: EventObserver,
}


export default class DragDrop {
    private _element: Node
    private _dropAreas: Array<Node>
    private _areaFrom: Node | null
    private _areaDrop: Node | null
    public signals: SignalsType

    constructor(dragElement: Node, dropAreas: NodeList) {
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

    dragStart(e: DragEvent): void {
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move";
        }
        if (e.target) {
            const target = e.target as HTMLElement
            target.classList.add('dragged');
            this._areaFrom = target.parentElement;
        }
        this._areaDrop = null;

        document.addEventListener('dragover', this.dragOver);
        document.addEventListener('dragenter', this.dragEnter);
        document.addEventListener('dragleave', this.dragLeave);
        document.addEventListener('drop', this.dragDrop);

        type emitType = {
            originalEvent: DragEvent
            dragElement: Node | null
            dropAreas: Node[] | null
        }

        const data: emitType = {
            originalEvent: e,
            dragElement: this._element,
            dropAreas: this._dropAreas
        }

        this.signals.dragStart.emit(data);

    }

    dragEnd(e: DragEvent): void {
        document.removeEventListener('dragover', this.dragOver);
        document.removeEventListener('dragenter', this.dragEnter);
        document.removeEventListener('dragleave', this.dragLeave);
        document.removeEventListener('drop', this.dragDrop);

        type emitType = {
            originalEvent: DragEvent
            dragElement: Node | null
            areaDrop: Node | null
            areaFrom: Node | null
        }

        const data: emitType = {
            originalEvent: e,
            dragElement: this._element,
            areaDrop: this._areaDrop,
            areaFrom: this._areaFrom
        }

        this.signals.dragEnd.emit(data);
    }

    dragOver(e: DragEvent): void {
        e.preventDefault();
    }

    dragEnter(e: DragEvent): void {
        e.preventDefault();
        const area = [...this._dropAreas].find(area => area === e.target);
        if (!area) return;

        type emitType = {
            originalEvent: DragEvent
            dragElement: Node | null
            areaEnter: Node | null
            areaFrom: Node | null
        }

        const data: emitType = {
            originalEvent: e,
            dragElement: this._element,
            areaEnter: area,
            areaFrom: this._areaFrom
        }

        this.signals.dragEnter.emit(data);
    }

    dragLeave(e: DragEvent): void {
        const area = [...this._dropAreas].find(area => area === e.target);
        if (!area) return;

        type emitType = {
            originalEvent: DragEvent
            dragElement: Node | null
            areaLeave: Node | null
            areaFrom: Node | null
        }

        const data: emitType = {
            originalEvent: e,
            dragElement: this._element,
            areaLeave: area,
            areaFrom: this._areaFrom
        }

        this.signals.dragLeave.emit(data);
    }

    dragDrop(e: DragEvent): void {
        const area = [...this._dropAreas].find(area => area === e.target);
        if (area) {
            this._areaDrop = area;
        }

        type emitType = {
            originalEvent: DragEvent
            dragElement: Node | null
            areaDrop: Node | null
            areaFrom: Node | null
        }

        const data: emitType = {
            originalEvent: e,
            dragElement: this._element,
            areaFrom: this._areaFrom,
            areaDrop: this._areaDrop
        }

        this.signals.dragDrop.emit(data);
    }

    bindEvents(): void {
        if (this._element) {
            this._element.addEventListener('dragstart', this.dragStart);
            this._element.addEventListener('dragend', this.dragEnd);
        }
    }

    unbindEvents(): void {
        if (this._element) {
            this._element.removeEventListener('dragstart', this.dragStart);
            this._element.removeEventListener('dragend', this.dragEnd);
        }
    }
}