import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * Adds drag and drop functionality to an element.
 */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[dragDrop]'
})
export class DragDropDirective {
    /**
     * Emits the dropped files to the parent.
     */
    @Output()
    files: EventEmitter<File[]> = new EventEmitter<File[]>();

    constructor() { }

    /**
     * Prevents the event default.
     *
     * @param evt - The Event when dragged files hover over the parent.
     */
    @HostListener('dragover', ['$event'])
    onDragOver(evt: DragEvent): void {
        evt.preventDefault();
        evt.stopPropagation();
    }

    /**
     * Prevents the event default.
     *
     * @param evt - The Event when dragged files leave the parent.
     */
    @HostListener('dragleave', ['$event'])
    onDragLeave(evt: DragEvent): void {
        evt.preventDefault();
        evt.stopPropagation();
    }

    /**
     * Prevents the event default and emits the dropped files with the output.
     *
     * @param evt - The Event when files are dropped.
     */
    @HostListener('drop', ['$event'])
    onDrop(evt: DragEvent): void {
        evt.preventDefault();
        evt.stopPropagation();
        if (evt.dataTransfer && evt.dataTransfer.files.length > 0) {
            this.files.emit(Array.from(evt.dataTransfer.files));
        }
    }
}