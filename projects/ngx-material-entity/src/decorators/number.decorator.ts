import { PropertyDecoratorConfig } from './base/property-decorator-config.interface';
import { baseProperty } from './base/base-property.decorator';
import { DecoratorTypes } from './base/decorator-types.enum';

/**
 * Decorator for setting and getting string propery metadata
 * @param metadata The metadata of the string property
 */
export function number(metadata: DefaultNumberDecoratorConfig | DropdownNumberDecoratorConfig) {
    if (metadata.displayStyle === 'dropdown') {
        return baseProperty(new DropdownNumberDecoratorConfig(metadata), DecoratorTypes.NUMBER_DROPDOWN);
    }
    else {
        return baseProperty(new DefaultNumberDecoratorConfig(metadata), DecoratorTypes.NUMBER);
    }
}

/**
 * Interface definition for the @number metadata
 */
abstract class NumberDecoratorConfig extends PropertyDecoratorConfig {
    /**
     * Whether to display the number in a single line or as a dropdown
     */
    displayStyle!: 'line' | 'dropdown';
}

export class DefaultNumberDecoratorConfig extends NumberDecoratorConfig {
    override displayStyle: 'line';
    /**
     * (optional) The minimum value of the number
     */
    min?: number;
    /**
     * (optional) The maximum value of the number
     */
    max?: number;

    constructor(metadata: DefaultNumberDecoratorConfig) {
        super(metadata.displayName, metadata.display, metadata.required, metadata.omitForCreate, metadata.omitForUpdate, metadata.defaultWidths);
        this.displayStyle = metadata.displayStyle;
        this.min = metadata.min;
        this.max = metadata.max;
    }
}
export class DropdownNumberDecoratorConfig extends NumberDecoratorConfig {
    override displayStyle: 'dropdown';
    /**
     * The values of the dropdown, consisting of a name to display and the actual value
     * Can also receive a function to determine the values
     */
    dropdownValues?: { displayName: string, value: number }[];

    constructor(metadata: DropdownNumberDecoratorConfig) {
        super(metadata.displayName, metadata.display, metadata.required, metadata.omitForCreate, metadata.omitForUpdate, metadata.defaultWidths);
        this.displayStyle = metadata.displayStyle;
        this.dropdownValues = metadata.dropdownValues;
    }
}