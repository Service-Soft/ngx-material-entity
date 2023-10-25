import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * A directive that only allows number inputs.
 */
@Directive({
    selector: '[number]',
    standalone: true
})
export class NumberDirective {
    constructor(private readonly el: ElementRef) {}

    /**
     * Prevents the default event when a key is pressed that is not a valid number, eg. 'A', 'B', 'C', 'D' etc.
     * @param e - The keydown event from the user.
     */
    @HostListener('keydown', ['$event'])
    onKeyDown(e: KeyboardEvent): void {
        if (
            !isNaN(parseInt(e.key))
            || ['.', ',', 'Escape', 'Enter', 'Delete', 'Backspace', 'Home', 'End', 'Left', 'Right', 'Tab'].includes(e.key)
            || (e.ctrlKey || e.metaKey) // && ['a', 'c', 'v', 'x', 'z'].includes(e.key)
        ) {
            return;
        }
        e.preventDefault();
    }
}