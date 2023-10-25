import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

/**
 * A Validator that checks if the input value is one of the provided values of the "includedIn" array.
 */
@Directive({
    selector: '[includedIn]',
    providers: [{ provide: NG_VALIDATORS, useExisting: IncludedInValidatorDirective, multi: true }],
    standalone: true
})
export class IncludedInValidatorDirective implements Validator {

    /**
     * The values that are valid for the input.
     */
    @Input()
    includedIn!: unknown[] | undefined;

    // eslint-disable-next-line jsdoc/require-jsdoc
    validate(control: AbstractControl): ValidationErrors | null {
        if (!this.includedIn?.length) {
            return null;
        }
        // eslint-disable-next-line typescript/no-unsafe-assignment
        return this.includedIn.includes(control.value) ? null : { includedIn: { value: control.value, validValues: this.includedIn } };
    }
}