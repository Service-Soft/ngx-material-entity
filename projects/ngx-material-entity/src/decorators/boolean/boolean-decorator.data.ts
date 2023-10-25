import { PropertyDecoratorConfig } from '../base/property-decorator.data';

/**
 * The Definition for the @boolean metadata.
 */
abstract class BooleanDecoratorConfig extends PropertyDecoratorConfig<boolean> {
    /**
     * Whether to display the booleans as a checkbox, a toggle button or as a dropdown.
     */
    displayStyle!: 'checkbox' | 'dropdown' | 'toggle';
}

/**
 * The configuration options for a boolean property displayed in a dropdown.
 */
export interface DropdownBooleanDecoratorConfig extends BooleanDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'dropdown',
    /**
     * The name of the true value if displayStyle dropdown is used.
     * @default 'Yes'
     */
    dropdownTrue?: string,
    /**
     * The name of the false value if displayStyle dropdown is used.
     * @default 'No'
     */
    dropdownFalse?: string
}

/**
 * The configuration options for a boolean property displayed as a checkbox.
 */
export interface CheckboxBooleanDecoratorConfig extends BooleanDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'checkbox'
}
/**
 * The configuration options for a boolean property displayed as a mat-toggle.
 */
export interface ToggleBooleanDecoratorConfig extends BooleanDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'toggle'
}