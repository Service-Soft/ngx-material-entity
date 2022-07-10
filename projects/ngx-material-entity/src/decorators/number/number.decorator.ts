import { baseProperty } from '../base/base-property.decorator';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { DefaultNumberDecoratorConfig, DropdownNumberDecoratorConfig } from './number-decorator.data';
import { DefaultNumberDecoratorConfigInternal, DropdownNumberDecoratorConfigInternal } from './number-decorator-internal.data';

/**
 * Decorator for setting and getting string propery metadata.
 *
 * @param metadata - The metadata of the string property.
 * @returns The method that defines the metadata.
 */
export function number(
    metadata: DefaultNumberDecoratorConfig | DropdownNumberDecoratorConfig
): (target: object, propertyKey: string) => void {
    if (metadata.displayStyle === 'dropdown') {
        return baseProperty(new DropdownNumberDecoratorConfigInternal(metadata), DecoratorTypes.NUMBER_DROPDOWN);
    }
    else {
        return baseProperty(new DefaultNumberDecoratorConfigInternal(metadata), DecoratorTypes.NUMBER);
    }
}