import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { CheckboxBooleanDecoratorConfig, DropdownBooleanDecoratorConfig, ToggleBooleanDecoratorConfig } from './boolean-decorator.data';

/**
 * The internal DropdownBooleanDecoratorConfig. Sets default values.
 */
export class DropdownBooleanDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements DropdownBooleanDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'dropdown';
    // eslint-disable-next-line jsdoc/require-jsdoc
    dropdownTrue: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    dropdownFalse: string;

    constructor(data: DropdownBooleanDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.dropdownTrue = data.dropdownTrue;
        this.dropdownFalse = data.dropdownFalse;
    }
}

/**
 * The internal CheckboxBooleanDecoratorConfig. Sets default values.
 */
export class CheckboxBooleanDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements CheckboxBooleanDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'checkbox';

    constructor(data: CheckboxBooleanDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.required = data.required ?? false;
    }
}

/**
 * The internal ToggleBooleanDecoratorConfig. Sets default values.
 */
export class ToggleBooleanDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements ToggleBooleanDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'toggle';

    constructor(data: ToggleBooleanDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.required = data.required ?? false;
    }
}