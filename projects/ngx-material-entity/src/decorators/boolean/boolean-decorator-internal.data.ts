import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { CheckboxBooleanDecoratorConfig, DropdownBooleanDecoratorConfig, ToggleBooleanDecoratorConfig } from './boolean-decorator.data';

export class DropdownBooleanDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements DropdownBooleanDecoratorConfig {
    displayStyle: 'dropdown';
    dropdownTrue: string;
    dropdownFalse: string;

    constructor(data: DropdownBooleanDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.dropdownTrue = data.dropdownTrue;
        this.dropdownFalse = data.dropdownFalse;
    }
}

export class CheckboxBooleanDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements CheckboxBooleanDecoratorConfig {
    displayStyle: 'checkbox';

    constructor(data: CheckboxBooleanDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
    }
}

export class ToggleBooleanDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements ToggleBooleanDecoratorConfig {
    displayStyle: 'toggle';

    constructor(data: ToggleBooleanDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
    }
}