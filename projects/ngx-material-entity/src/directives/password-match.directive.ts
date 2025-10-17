import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

/**
 * A directive that validates if a given password matches the control value.
 */
@Directive({
    selector: '[passwordMatch]',
    standalone: true,
    providers: [{ provide: NG_VALIDATORS, useExisting: PasswordMatchValidatorDirective, multi: true }]
})
export class PasswordMatchValidatorDirective implements Validator {

    /**
     * The password that the control value should be matched against.
     */
    @Input()
    passwordMatch?: string;

    // eslint-disable-next-line jsdoc/require-jsdoc
    validate(control: AbstractControl): ValidationErrors | null {
        // eslint-disable-next-line typescript/no-unsafe-assignment, unicorn/no-null
        return this.passwordMatch == control.value ? null : { passwordMatch: { value: control.value } };
    }
}