import { EntityUtilities } from '../../classes/entity.utilities';
import { baseProperty } from '../base/base-property.decorator';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { AutocompleteStringDecoratorConfigInternal, DefaultStringDecoratorConfigInternal, DropdownStringDecoratorConfigInternal, PasswordStringDecoratorConfigInternal, TextboxStringDecoratorConfigInternal } from './string-decorator-internal.data';
import { AutocompleteStringDecoratorConfig, DefaultStringDecoratorConfig, DropdownStringDecoratorConfig, PasswordStringDecoratorConfig, TextboxStringDecoratorConfig } from './string-decorator.data';

/**
 * Decorator for setting and getting string Property metadata.
 *
 * @param metadata - The metadata of the string property.
 * @returns The method that defines the metadata.
 */
export function string(
    metadata: DropdownStringDecoratorConfig | AutocompleteStringDecoratorConfig
    | DefaultStringDecoratorConfig | TextboxStringDecoratorConfig | PasswordStringDecoratorConfig
): (target: object, propertyKey: string) => void {
    switch (metadata.displayStyle) {
        case 'dropdown':
            return baseProperty(new DropdownStringDecoratorConfigInternal(metadata), DecoratorTypes.STRING_DROPDOWN);
        case 'autocomplete':
            return baseProperty(new AutocompleteStringDecoratorConfigInternal(metadata), DecoratorTypes.STRING_AUTOCOMPLETE);
        case 'textbox':
            return baseProperty(new TextboxStringDecoratorConfigInternal(metadata), DecoratorTypes.STRING_TEXTBOX);
        case 'password':
            return baseProperty(
                new PasswordStringDecoratorConfigInternal(metadata),
                DecoratorTypes.STRING_PASSWORD,
                [EntityUtilities.CONFIRM_PASSWORD_KEY]
            );
        default:
            return baseProperty(new DefaultStringDecoratorConfigInternal(metadata), DecoratorTypes.STRING);
    }
}