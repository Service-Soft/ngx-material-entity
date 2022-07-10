import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { DefaultNumberDecoratorConfig, DropdownNumberDecoratorConfig } from './number-decorator.data';

export class DefaultNumberDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements DefaultNumberDecoratorConfig {
    displayStyle: 'line';
    min?: number;
    max?: number;

    constructor(data: DefaultNumberDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.max = data.max;
        this.min = data.min;
    }
}

export class DropdownNumberDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements DropdownNumberDecoratorConfig {
    displayStyle: 'dropdown';
    dropdownValues: { displayName: string, value: number }[];

    constructor(data: DropdownNumberDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.dropdownValues = data.dropdownValues;
    }
}