import { baseProperty } from '../base/base-property.decorator';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { AutocompleteStringDecoratorConfigInternal, DefaultStringDecoratorConfigInternal, DropdownStringDecoratorConfigInternal, TextboxStringDecoratorConfigInternal } from './string-decorator-internal.data';
import { AutocompleteStringDecoratorConfig, DefaultStringDecoratorConfig, DropdownStringDecoratorConfig, TextboxStringDecoratorConfig } from './string-decorator.data';

/**
 * Decorator for setting and getting string propery metadata.
 *
 * @param metadata - The metadata of the string property.
 * @returns The method that defines the metadata.
 */
export function string(
    metadata: DropdownStringDecoratorConfig | AutocompleteStringDecoratorConfig
        | DefaultStringDecoratorConfig | TextboxStringDecoratorConfig
): (target: object, propertyKey: string) => void {
    if (metadata.displayStyle === 'dropdown') {
        return baseProperty(new DropdownStringDecoratorConfigInternal(metadata), DecoratorTypes.STRING_DROPDOWN);
    }
    else if (metadata.displayStyle === 'autocomplete') {
        return baseProperty(new AutocompleteStringDecoratorConfigInternal(metadata), DecoratorTypes.STRING_AUTOCOMPLETE);
    }
    else if (metadata.displayStyle === 'textbox') {
        return baseProperty(new TextboxStringDecoratorConfigInternal(metadata), DecoratorTypes.STRING_TEXTBOX);
    }
    else {
        return baseProperty(new DefaultStringDecoratorConfigInternal(metadata), DecoratorTypes.STRING);
    }
}