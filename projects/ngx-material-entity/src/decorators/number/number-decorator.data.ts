import { PropertyDecoratorConfig } from '../base/property-decorator.data';

/**
 * Definition for the @number metadata.
 */
abstract class NumberDecoratorConfig extends PropertyDecoratorConfig {
    /**
     * Whether to display the number in a single line or as a dropdown.
     */
    displayStyle!: 'line' | 'dropdown';
}

export interface DefaultNumberDecoratorConfig extends NumberDecoratorConfig {
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

export interface DropdownNumberDecoratorConfig extends NumberDecoratorConfig {
    displayStyle: 'dropdown',
    /**
     * The values of the dropdown, consisting of a name to display and the actual value.
     */
    dropdownValues: { displayName: string, value: number }[]
}