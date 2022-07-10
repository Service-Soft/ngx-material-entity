import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { AutocompleteStringDecoratorConfig, DefaultStringDecoratorConfig, DropdownStringDecoratorConfig, TextboxStringDecoratorConfig } from './string-decorator.data';

export class DropdownStringDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements DropdownStringDecoratorConfig {
    displayStyle: 'dropdown';
    dropdownValues: { displayName: string, value: string }[];

    constructor(data: DropdownStringDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.dropdownValues = data.dropdownValues;
    }
}

export class DefaultStringDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements DefaultStringDecoratorConfig {
    displayStyle: 'line';
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;

    constructor(data: DefaultStringDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.minLength = data.minLength;
        this.maxLength = data.maxLength;
        this.regex = data.regex;
    }
}

export class TextboxStringDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements TextboxStringDecoratorConfig {
    displayStyle: 'textbox';
    minLength?: number;
    maxLength?: number;

    constructor(data: TextboxStringDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.minLength = data.minLength;
        this.maxLength = data.maxLength;
    }
}

export class AutocompleteStringDecoratorConfigInternal
    extends PropertyDecoratorConfigInternal implements AutocompleteStringDecoratorConfig {

    displayStyle: 'autocomplete';
    autocompleteValues: string[];
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;

    constructor(data: AutocompleteStringDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.autocompleteValues = data.autocompleteValues;
        this.minLength = data.minLength;
        this.maxLength = data.maxLength;
        this.regex = data.regex;
    }
}