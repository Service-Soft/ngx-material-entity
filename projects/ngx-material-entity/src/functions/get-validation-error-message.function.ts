import { InjectionToken } from '@angular/core';
import { NgModel } from '@angular/forms';

/**
 * Provider for the default getValidationErrorMessage.
 */
// eslint-disable-next-line constCase/uppercase
export const NGX_GET_VALIDATION_ERROR_MESSAGE: InjectionToken<() => string> = new InjectionToken(
    'Provider for the default getValidationErrorMessage.',
    {
        providedIn: 'root',
        factory: () => getValidationErrorMessage
    }
);

/**
 * Generates a default error message for most validation errors.
 * @param model - The ngModel to get the error from.
 * @returns The Validation Error Message to display.
 */
function getValidationErrorMessage(model: NgModel): string {
    if (model.hasError('matDatepickerParse')) {
        return 'not a valid date';
    }
    else if (model.hasError('email')) {
        return 'not a valid email';
    }
    else if (model.hasError('minlength')) {
        // eslint-disable-next-line typescript/no-unsafe-member-access
        return `needs to be at least ${model.getError('minlength').requiredLength} characters long`;
    }
    else if (model.hasError('maxlength')) {
        // eslint-disable-next-line typescript/no-unsafe-member-access
        return `needs to be at most ${model.getError('maxlength').requiredLength} characters long`;
    }
    else if (model.hasError('min')) {
        // eslint-disable-next-line typescript/no-unsafe-member-access
        return `needs to be equal or bigger than ${model.getError('min').min}`;
    }
    else if (model.hasError('max')) {
        // eslint-disable-next-line typescript/no-unsafe-member-access
        return `needs to be equal or smaller than ${model.getError('max').max}`;
    }
    else if (model.hasError('passwordMatch')) {
        return 'Passwords need to match!';
    }
    else if (model.hasError('required')) {
        return 'required';
    }
    else if (model.hasError('includedIn')) {
        return 'Needs to be one of the provided values';
    }
    // eslint-disable-next-line typescript/no-unsafe-member-access
    else if (model.hasError('pattern') && model.getError('pattern').requiredPattern === '^true$') {
        return 'needs to be selected';
    }
    else {
        return 'invalid input';
    }
}