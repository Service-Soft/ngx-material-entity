import { DropdownValue } from '../base/dropdown-value.interface';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { DefaultNumberDecoratorConfig, DropdownNumberDecoratorConfig } from './number-decorator.data';

/**
 * The internal DefaultNumberDecoratorConfig. Sets default values.
 */
export class DefaultNumberDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements DefaultNumberDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'line';
    // eslint-disable-next-line jsdoc/require-jsdoc
    min?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    max?: number;

    constructor(data: DefaultNumberDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.max = data.max;
        this.min = data.min;
    }
}

/**
 * The internal DropdownNumberDecoratorConfig. Sets default values.
 */
export class DropdownNumberDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements DropdownNumberDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'dropdown';
    // eslint-disable-next-line jsdoc/require-jsdoc
    dropdownValues: DropdownValue<number>[];

    constructor(data: DropdownNumberDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.dropdownValues = data.dropdownValues;
    }
}