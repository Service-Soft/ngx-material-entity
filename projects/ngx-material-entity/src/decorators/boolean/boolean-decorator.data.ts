import { PropertyDecoratorConfig } from '../base/property-decorator.data';

/**
 * The Definition for the @boolean metadata.
 */
abstract class BooleanDecoratorConfig extends PropertyDecoratorConfig {
    /**
     * Whether to display the booleans as a checkbox, a toggle button or as a dropdown.
     */
    displayStyle!: 'checkbox' | 'dropdown' | 'toggle';
}

export interface DropdownBooleanDecoratorConfig extends BooleanDecoratorConfig {
    displayStyle: 'dropdown',
    /**
     * The name of the true value if displayStyle dropdown is used.
     */
    dropdownTrue: string,
    /**
     * The name of the false value if displayStyle dropdown is used.
     */
    dropdownFalse: string
}

export interface CheckboxBooleanDecoratorConfig extends BooleanDecoratorConfig {
    displayStyle: 'checkbox'
}
export interface ToggleBooleanDecoratorConfig extends BooleanDecoratorConfig {
    displayStyle: 'toggle'
}