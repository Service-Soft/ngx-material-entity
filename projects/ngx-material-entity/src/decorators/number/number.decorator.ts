import { baseProperty } from '../base/base-property.decorator';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { DefaultNumberDecoratorConfig, DropdownNumberDecoratorConfig, SliderNumberDecoratorConfig } from './number-decorator.data';
import { DefaultNumberDecoratorConfigInternal, DropdownNumberDecoratorConfigInternal, SliderNumberDecoratorConfigInternal } from './number-decorator-internal.data';

/**
 * Decorator for setting and getting number property metadata.
 * @param metadata - The metadata of the number property.
 * @returns The method that defines the metadata.
 */
export function number(
    metadata: DefaultNumberDecoratorConfig | DropdownNumberDecoratorConfig | SliderNumberDecoratorConfig
): (target: object, propertyKey: string) => void {
    switch (metadata.displayStyle) {
        case 'dropdown':
            return baseProperty(new DropdownNumberDecoratorConfigInternal(metadata), DecoratorTypes.NUMBER_DROPDOWN);
        case 'slider':
            return baseProperty(new SliderNumberDecoratorConfigInternal(metadata), DecoratorTypes.NUMBER_SLIDER);
        default:
            return baseProperty(new DefaultNumberDecoratorConfigInternal(metadata), DecoratorTypes.NUMBER);
    }
}