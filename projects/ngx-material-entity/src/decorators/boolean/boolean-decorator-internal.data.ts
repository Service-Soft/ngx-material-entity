import { getConfigValue } from '../../functions/get-config-value.function';
import { NgxGlobalDefaultValues } from '../../global-configuration-values';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { CheckboxBooleanDecoratorConfig, DropdownBooleanDecoratorConfig, ToggleBooleanDecoratorConfig } from './boolean-decorator.data';

/**
 * The internal DropdownBooleanDecoratorConfig. Sets default values.
 */
export class DropdownBooleanDecoratorConfigInternal extends PropertyDecoratorConfigInternal<boolean>
    implements DropdownBooleanDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'dropdown';
    // eslint-disable-next-line jsdoc/require-jsdoc
    dropdownTrue: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    dropdownFalse: string;

    constructor(data: DropdownBooleanDecoratorConfig, globalConfig: NgxGlobalDefaultValues) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.dropdownTrue = getConfigValue(globalConfig.dropdownTrue, data.dropdownTrue);
        this.dropdownFalse = getConfigValue(globalConfig.dropdownFalse, data.dropdownFalse);
    }
}

/**
 * The internal CheckboxBooleanDecoratorConfig. Sets default values.
 */
export class CheckboxBooleanDecoratorConfigInternal extends PropertyDecoratorConfigInternal<boolean>
    implements CheckboxBooleanDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'checkbox';

    constructor(data: CheckboxBooleanDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.required = this.booleanToFunction(data.required ?? false);
    }
}

/**
 * The internal ToggleBooleanDecoratorConfig. Sets default values.
 */
export class ToggleBooleanDecoratorConfigInternal extends PropertyDecoratorConfigInternal<boolean> implements ToggleBooleanDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'toggle';

    constructor(data: ToggleBooleanDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.required = this.booleanToFunction(data.required ?? false);
    }
}