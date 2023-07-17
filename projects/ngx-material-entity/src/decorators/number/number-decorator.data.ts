import { DropdownValue } from '../base/dropdown-value.interface';
import { PropertyDecoratorConfig } from '../base/property-decorator.data';

// eslint-disable-next-line jsdoc/require-jsdoc
export type NumberDropdownValues =
    DropdownValue<number | undefined>[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((entity: any) => DropdownValue<number | undefined>[])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((entity: any) => Promise<DropdownValue<number | undefined>[]>)

/**
 * Definition for the @number metadata.
 */
abstract class NumberDecoratorConfig extends PropertyDecoratorConfig {
    /**
     * Whether to display the number in a single line or as a dropdown.
     */
    displayStyle!: 'line' | 'dropdown' | 'slider';
}

/**
 * The configuration options for a number property displayed in a default number input.
 */
export interface DefaultNumberDecoratorConfig extends NumberDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'line',
    /**
     * The minimum value of the number.
     */
    min?: number,
    /**
     * The maximum value of the number.
     */
    max?: number
}

/**
 * The configuration options for a number property displayed in a dropdown.
 */
export interface DropdownNumberDecoratorConfig extends NumberDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'dropdown',
    /**
     * The values of the dropdown, consisting of a name to display and the actual value.
     */
    dropdownValues: NumberDropdownValues
}

/**
 * The configuration options for a number property displayed as a slider input.
 */
export interface SliderNumberDecoratorConfig extends NumberDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'slider',
    /**
     * The minimum value of the number.
     */
    min?: number,
    /**
     * The maximum value of the number.
     */
    max?: number,
    /**
     * How big a single step is at which the thumb label will snap.
     */
    step?: number,
    /**
     * Function that transforms the value to display inside the thumb label.
     */
    formatThumbLabelValue?: (value: number) => string,
    /**
     * Whether or not ticks should be displayed.
     */
    showTickMarks?: boolean
}