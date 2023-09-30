import { InjectionToken, inject } from '@angular/core';
import { ValidationError } from '../utilities/validation.utilities';

export const NGX_VALIDATION_ERRORS_TOOLTIP_TITLE: InjectionToken<string> = new InjectionToken(
    'Provider for the validation errors tooltip title.',
    {
        providedIn: 'root',
        factory: () => 'Validation Errors:'
    }
);

/**
 * The default function that gets the validation errors tooltip content.
 *
 * @param validationErrors - All validation errors for which the tooltip content should be generated.
 * @returns A html string, containing a list of the name of each invalid property.
 */
export function getValidationErrorsTooltipContent(validationErrors: ValidationError[]): string {
    const title: string = inject(NGX_VALIDATION_ERRORS_TOOLTIP_TITLE);
    let res: string = `${title}\n<br>\n<ul style="margin-bottom: 0px; padding-left: 16px;">`;
    for (const error of validationErrors) {
        res = res.concat(`\n\t<li>${error.property}</li>`);
    }
    res = res.concat('\n</ul>');
    return res;
}