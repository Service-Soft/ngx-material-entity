import { DropdownValue } from '../base/dropdown-value.interface';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { DefaultNumberDecoratorConfig, DropdownNumberDecoratorConfig, SliderNumberDecoratorConfig } from './number-decorator.data';

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

/**
 * The internal SliderNumberDecoratorConfig. Sets default values.
 */
export class SliderNumberDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements SliderNumberDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'slider';
    // eslint-disable-next-line jsdoc/require-jsdoc
    min?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    max?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    step?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    formatThumbLabelValue: (value: number) => string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    showTickMarks?: boolean;

    constructor(data: SliderNumberDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.max = data.max;
        this.min = data.min;
        this.step = data.step;
        this.formatThumbLabelValue = data.formatThumbLabelValue ?? defaultFormatThumbLabelValue;
        this.showTickMarks = data.showTickMarks;
    }
}

/**
 * The default function to format values for the number slider thumb label.
 *
 * @param value - The value of the slider.
 * @returns Just the value without any formatting done.
 */
export function defaultFormatThumbLabelValue(value: number): string {
    return value.toString();
}