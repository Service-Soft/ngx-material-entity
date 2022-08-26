import { DropdownValue } from '../base/dropdown-value.interface';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { AutocompleteStringDecoratorConfig, DefaultStringDecoratorConfig, DropdownStringDecoratorConfig, PasswordStringDecoratorConfig, TextboxStringDecoratorConfig } from './string-decorator.data';

/**
 * The internal DropdownStringDecoratorConfig. Sets default values.
 */
export class DropdownStringDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements DropdownStringDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'dropdown';
    // eslint-disable-next-line jsdoc/require-jsdoc
    dropdownValues: DropdownValue<string>[];

    constructor(data: DropdownStringDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.dropdownValues = data.dropdownValues;
    }
}

/**
 * The internal DefaultStringDecoratorConfig. Sets default values.
 */
export class DefaultStringDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements DefaultStringDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'line';
    // eslint-disable-next-line jsdoc/require-jsdoc
    minLength?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxLength?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    regex?: RegExp;

    constructor(data: DefaultStringDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.minLength = data.minLength;
        this.maxLength = data.maxLength;
        this.regex = data.regex;
    }
}

/**
 * The internal TextboxStringDecoratorConfig. Sets default values.
 */
export class TextboxStringDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements TextboxStringDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'textbox';
    // eslint-disable-next-line jsdoc/require-jsdoc
    minLength?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxLength?: number;

    constructor(data: TextboxStringDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.minLength = data.minLength;
        this.maxLength = data.maxLength;
    }
}

/**
 * The internal AutocompleteStringDecoratorConfig. Sets default values.
 */
export class AutocompleteStringDecoratorConfigInternal
    extends PropertyDecoratorConfigInternal implements AutocompleteStringDecoratorConfig {

    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'autocomplete';
    // eslint-disable-next-line jsdoc/require-jsdoc
    autocompleteValues: string[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    minLength?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxLength?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
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

/**
 * The internal PasswordStringDecoratorConfig. Sets default values.
 */
export class PasswordStringDecoratorConfigInternal
    extends PropertyDecoratorConfigInternal implements PasswordStringDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'password';
    // eslint-disable-next-line jsdoc/require-jsdoc
    minLength?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxLength?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    regex?: RegExp;
    // eslint-disable-next-line jsdoc/require-jsdoc
    needsConfirmation: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    confirmationDisplayName: string;

    constructor(data: PasswordStringDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.minLength = data.minLength;
        this.maxLength = data.maxLength;
        this.regex = data.regex;
        this.needsConfirmation = data.needsConfirmation ?? true;
        this.confirmationDisplayName = data.confirmationDisplayName ?? 'Confirm Password';
    }
}