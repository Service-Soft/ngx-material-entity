import { PropertyDecoratorConfig } from '../base/property-decorator.data';

/**
 * Definition for the @string metadata.
 */
abstract class StringDecoratorConfig extends PropertyDecoratorConfig {
    /**
     * How to display the string.
     */
    displayStyle!: 'line' | 'textbox' | 'autocomplete' | 'dropdown';
}

export interface DropdownStringDecoratorConfig extends StringDecoratorConfig {
    displayStyle: 'dropdown',
    /**
     * The values of the dropdown, consisting of a name to display and the actual value
     * Can also receive a function to determine the values.
     */
    dropdownValues: { displayName: string, value: string }[]
}

export interface DefaultStringDecoratorConfig extends StringDecoratorConfig {
    displayStyle: 'line',
    /**
     * The minimum required length of the string.
     */
    minLength?: number,
    /**
     * The maximum required length of the string.
     */
    maxLength?: number,
    /**
     * A regex used for validation.
     */
    regex?: RegExp
}

export interface TextboxStringDecoratorConfig extends StringDecoratorConfig {
    displayStyle: 'textbox',
    /**
     * The minimum required length of the string.
     */
    minLength?: number,
    /**
     * The maximum required length of the string.
     */
    maxLength?: number
}

export interface AutocompleteStringDecoratorConfig extends StringDecoratorConfig {
    displayStyle: 'autocomplete',
    /**
     * The autocomplete values.
     */
    autocompleteValues: string[],
    /**
     * The minimum required length of the string.
     */
    minLength?: number,
    /**
     * The maximum required length of the string.
     */
    maxLength?: number,
    /**
     * A regex used for validation.
     */
    regex?: RegExp
}