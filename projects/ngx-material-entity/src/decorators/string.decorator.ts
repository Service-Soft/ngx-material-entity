import { PropertyDecoratorConfig } from './base/property-decorator-config.interface';
import { baseProperty } from './base/base-property.decorator';
import { DecoratorTypes } from './base/decorator-types.enum';

/**
 * Decorator for setting and getting string propery metadata
 * @param metadata The metadata of the string property
 */
export function string(metadata: DropdownStringDecoratorConfig | AutocompleteStringDecoratorConfig | DefaultStringDecoratorConfig | TextboxStringDecoratorConfig) {
    if (metadata.displayStyle === 'dropdown') {
        return baseProperty(new DropdownStringDecoratorConfig(metadata), DecoratorTypes.STRING_DROPDOWN);
    }
    else if(metadata.displayStyle === 'autocomplete') {
        return baseProperty(new AutocompleteStringDecoratorConfig(metadata), DecoratorTypes.STRING_AUTOCOMPLETE);
    }
    else if (metadata.displayStyle === 'textbox') {
        return baseProperty(new TextboxStringDecoratorConfig(metadata), DecoratorTypes.STRING_TEXTBOX);
    }
    else {
        return baseProperty(new DefaultStringDecoratorConfig(metadata), DecoratorTypes.STRING);
    }
}

/**
 * Interface definition for the @string metadata
 */
abstract class StringDecoratorConfig extends PropertyDecoratorConfig {
    /**
     * Whether to display the string in a single line or in a textbox
     */
    displayStyle!: 'line' | 'textbox' | 'autocomplete' | 'dropdown';
}

export class DropdownStringDecoratorConfig extends StringDecoratorConfig {
    override displayStyle: 'dropdown';
    /**
     * The values of the dropdown, consisting of a name to display and the actual value
     * Can also receive a function to determine the values
     */
    dropdownValues: { displayName: string, value: string }[];

    constructor(metadata: DropdownStringDecoratorConfig) {
        super(metadata.displayName, metadata.display, metadata.required, metadata.omitForCreate, metadata.omitForUpdate, metadata.defaultWidths);
        this.displayStyle = metadata.displayStyle;
        this.dropdownValues = metadata.dropdownValues;
    }
}

export class DefaultStringDecoratorConfig extends StringDecoratorConfig {
    override displayStyle: 'line';
    /**
     * (optional) The minimum required length of the string
     */
    minLength?: number;
    /**
     * (optional) The maximum required length of the string
     */
    maxLength?: number;
    /**
     * (optional) A regex used for validation
     */
    regex?: RegExp;

    constructor(metadata: DefaultStringDecoratorConfig) {
        super(metadata.displayName, metadata.display, metadata.required, metadata.omitForCreate, metadata.omitForUpdate, metadata.defaultWidths);
        this.displayStyle = metadata.displayStyle;
        this.minLength = metadata.minLength;
        this.maxLength = metadata.maxLength;
        this.regex = metadata.regex;
    }
}
export class TextboxStringDecoratorConfig extends StringDecoratorConfig {
    override displayStyle: 'textbox';
    /**
     * (optional) The minimum required length of the string
     */
    minLength?: number;
    /**
     * (optional) The maximum required length of the string
     */
    maxLength?: number;

    constructor(metadata: TextboxStringDecoratorConfig) {
        super(metadata.displayName, metadata.display, metadata.required, metadata.omitForCreate, metadata.omitForUpdate, metadata.defaultWidths);
        this.displayStyle = metadata.displayStyle;
        this.minLength = metadata.minLength;
        this.maxLength = metadata.maxLength;
    }
}

export class AutocompleteStringDecoratorConfig extends StringDecoratorConfig {
    override displayStyle: 'autocomplete';
    /**
     * The autocomplete values
     */
    autocompleteValues: string[];
    /**
     * (optional) The minimum required length of the string
     */
    minLength?: number;
    /**
     * (optional) The maximum required length of the string
     */
    maxLength?: number;
    /**
     * (optional) A regex used for validation
     */
    regex?: RegExp;

    constructor(metadata: AutocompleteStringDecoratorConfig) {
        super(metadata.displayName, metadata.display, metadata.required, metadata.omitForCreate, metadata.omitForUpdate, metadata.defaultWidths);
        this.displayStyle = metadata.displayStyle;
        this.autocompleteValues = metadata.autocompleteValues;
        this.minLength = metadata.minLength;
        this.maxLength = metadata.maxLength;
        this.regex = metadata.regex;
    }
}