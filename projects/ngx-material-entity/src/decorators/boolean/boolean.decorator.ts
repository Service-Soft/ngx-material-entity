import { needsUpdateGlobalDefaults } from '../../default-global-configuration-values';
import { baseProperty } from '../base/base-property.decorator';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { CheckboxBooleanDecoratorConfigInternal, DropdownBooleanDecoratorConfigInternal, ToggleBooleanDecoratorConfigInternal } from './boolean-decorator-internal.data';
import { CheckboxBooleanDecoratorConfig, DropdownBooleanDecoratorConfig, ToggleBooleanDecoratorConfig } from './boolean-decorator.data';

/**
 * Decorator for setting and getting boolean property metadata.
 * @param metadata - The metadata of the boolean property.
 * @returns The method that defines the metadata.
 */
export function boolean(
    metadata: CheckboxBooleanDecoratorConfig | ToggleBooleanDecoratorConfig | DropdownBooleanDecoratorConfig
): (target: object, propertyKey: string) => void {
    if (metadata.displayStyle === 'dropdown') {
        return baseProperty(
            new DropdownBooleanDecoratorConfigInternal(metadata, needsUpdateGlobalDefaults),
            DecoratorTypes.BOOLEAN_DROPDOWN
        );
    }
    else if (metadata.displayStyle === 'checkbox') {
        return baseProperty(new CheckboxBooleanDecoratorConfigInternal(metadata), DecoratorTypes.BOOLEAN_CHECKBOX);
    }
    else {
        return baseProperty(new ToggleBooleanDecoratorConfigInternal(metadata), DecoratorTypes.BOOLEAN_TOGGLE);
    }
}