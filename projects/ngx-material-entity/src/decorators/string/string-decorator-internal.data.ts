import { AutocompleteStringDecoratorConfig, DefaultStringDecoratorConfig, DropdownStringDecoratorConfig, PasswordStringDecoratorConfig, StringAutocompleteValues, TextboxStringDecoratorConfig } from './string-decorator.data';
import { dropdownValuesToFunction } from '../../functions/dropdown-values-to-function.function';
import { DropdownValue } from '../base/dropdown-value.interface';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';

/**
 * The internal DropdownStringDecoratorConfig. Sets default values.
 */
export class DropdownStringDecoratorConfigInternal extends PropertyDecoratorConfigInternal<string>
    implements DropdownStringDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'dropdown';
    // eslint-disable-next-line jsdoc/require-jsdoc, typescript/no-explicit-any
    dropdownValues: ((entity: any) => Promise<DropdownValue<string | undefined>[]>);

    constructor(data: DropdownStringDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.dropdownValues = dropdownValuesToFunction(data.dropdownValues);
    }
}

/**
 * The internal DefaultStringDecoratorConfig. Sets default values.
 */
export class DefaultStringDecoratorConfigInternal extends PropertyDecoratorConfigInternal<string> implements DefaultStringDecoratorConfig {
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
export class TextboxStringDecoratorConfigInternal extends PropertyDecoratorConfigInternal<string> implements TextboxStringDecoratorConfig {
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
    extends PropertyDecoratorConfigInternal<string> implements AutocompleteStringDecoratorConfig {

    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'autocomplete';
    // eslint-disable-next-line jsdoc/require-jsdoc, typescript/no-explicit-any
    autocompleteValues: (entity: any) => Promise<string[]>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    minLength?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxLength?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    regex?: RegExp;
    // eslint-disable-next-line jsdoc/require-jsdoc
    restrictToOptions?: boolean;

    constructor(data: AutocompleteStringDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.autocompleteValues = this.autocompleteValuesToFunction(data.autocompleteValues);
        this.minLength = data.minLength;
        this.maxLength = data.maxLength;
        this.regex = data.regex;
        this.restrictToOptions = data.restrictToOptions;
    }

    // eslint-disable-next-line typescript/no-explicit-any
    private autocompleteValuesToFunction(autocompleteValues: StringAutocompleteValues): (entity: any) => Promise<string[]> {
        if (Array.isArray(autocompleteValues)) {
            return async () => autocompleteValues;
        }
        // eslint-disable-next-line typescript/no-explicit-any
        return async (e: any) => await autocompleteValues(e);
    }
}

/**
 * The internal PasswordStringDecoratorConfig. Sets default values.
 */
export class PasswordStringDecoratorConfigInternal
    extends PropertyDecoratorConfigInternal<string> implements PasswordStringDecoratorConfig {
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
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayPasswordStrength: boolean;

    constructor(data: PasswordStringDecoratorConfig) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.minLength = data.minLength;
        this.maxLength = data.maxLength;
        this.regex = data.regex;
        this.needsConfirmation = data.needsConfirmation ?? true;
        this.confirmationDisplayName = data.confirmationDisplayName ?? 'Confirm Password';
        this.displayPasswordStrength = data.displayPasswordStrength ?? true;
        this.defaultWidths = data.defaultWidths ?? [12, 12, 12];
    }
}