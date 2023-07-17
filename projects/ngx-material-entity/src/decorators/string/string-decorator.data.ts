import { DropdownValue } from '../base/dropdown-value.interface';
import { PropertyDecoratorConfig } from '../base/property-decorator.data';

// eslint-disable-next-line jsdoc/require-jsdoc
export type StringDropdownValues =
    DropdownValue<string | undefined>[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((entity: any) => DropdownValue<string | undefined>[])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((entity: any) => Promise<DropdownValue<string | undefined>[]>)

/**
 * Definition for the @string metadata.
 */
abstract class StringDecoratorConfig extends PropertyDecoratorConfig {
    /**
     * How to display the string.
     */
    displayStyle!: 'line' | 'textbox' | 'autocomplete' | 'dropdown' | 'password';
}

/**
 * The configuration options for a string property displayed as a dropdown.
 */
export interface DropdownStringDecoratorConfig extends StringDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'dropdown',
    /**
     * The values of the dropdown, consisting of a name to display and the actual value
     * Can also receive a function to determine the values.
     */
    dropdownValues: StringDropdownValues
}

/**
 * The configuration options for a string property displayed in a default text input.
 */
export interface DefaultStringDecoratorConfig extends StringDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
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

/**
 * The configuration options for a string property displayed in a textbox input.
 */
export interface TextboxStringDecoratorConfig extends StringDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
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

/**
 * The configuration options for a string property displayed in a mat-autocomplete input.
 */
export interface AutocompleteStringDecoratorConfig extends StringDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
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

/**
 * The configuration options for a string property displayed in a password input.
 */
export interface PasswordStringDecoratorConfig extends StringDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'password',
    /**
     * The minimum required length of the password.
     */
    minLength?: number,
    /**
     * The maximum required length of the password.
     */
    maxLength?: number,
    /**
     * A regex used for validation.
     */
    regex?: RegExp,
    /**
     * Whether or not the password needs to be retyped.
     *
     * @default true
     */
    needsConfirmation?: boolean,
    /**
     * The display name of the confirmation password input.
     *
     * @default 'Confirm Password'
     */
    confirmationDisplayName?: string,
    /**
     * The error message to display when the password and the confirm password don't match.
     *
     * @default 'Passwords need to match!'
     */
    passwordsDontMatchErrorMessage?: string
}