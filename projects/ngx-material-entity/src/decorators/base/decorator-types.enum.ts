import { StringChipsArrayDecoratorConfig, EntityArrayDecoratorConfig, AutocompleteStringChipsArrayDecoratorConfig } from '../array.decorator';
import { Entity } from '../../classes/entity-model.class';
import { CheckboxBooleanDecoratorConfig, DropdownBooleanDecoratorConfig, ToggleBooleanDecoratorConfig } from '../boolean.decorator';
import { DefaultNumberDecoratorConfig, DropdownNumberDecoratorConfig } from '../number.decorator';
import { DefaultObjectDecoratorConfig } from '../object.decorator';
import { DefaultStringDecoratorConfig, DropdownStringDecoratorConfig, AutocompleteStringDecoratorConfig, TextboxStringDecoratorConfig } from '../string.decorator';

/**
 * The enum Values for all the different DecoratorTypes.
 */
export enum DecoratorTypes {
    STRING = 'string',
    STRING_DROPDOWN = 'stringDropdown',
    STRING_AUTOCOMPLETE = 'stringAutocomplete',
    STRING_TEXTBOX = 'stringTextbox',
    NUMBER = 'number',
    NUMBER_DROPDOWN = 'numberDropdown',
    BOOLEAN_CHECKBOX = 'boolean',
    BOOLEAN_TOGGLE = 'booleanToggle',
    BOOLEAN_DROPDOWN = 'booleanDropdown',
    OBJECT = 'object',
    ARRAY = 'array',
    ARRAY_STRING_CHIPS = 'arrayStringChips',
    ARRAY_STRING_AUTOCOMPLETE_CHIPS = 'arrayStringAutocompleteChips'
}

/**
 * Gives the metadata-config Type based ont the DecoratorTypes enum
 */
export type DecoratorType<T> =
    T extends DecoratorTypes.STRING ? DefaultStringDecoratorConfig
    : T extends DecoratorTypes.STRING_TEXTBOX ? TextboxStringDecoratorConfig
    : T extends DecoratorTypes.STRING_DROPDOWN ? DropdownStringDecoratorConfig
    : T extends DecoratorTypes.STRING_AUTOCOMPLETE ? AutocompleteStringDecoratorConfig
    : T extends DecoratorTypes.NUMBER ? DefaultNumberDecoratorConfig
    : T extends DecoratorTypes.NUMBER_DROPDOWN ? DropdownNumberDecoratorConfig
    : T extends DecoratorTypes.BOOLEAN_CHECKBOX ? CheckboxBooleanDecoratorConfig
    : T extends DecoratorTypes.BOOLEAN_TOGGLE ? ToggleBooleanDecoratorConfig
    : T extends DecoratorTypes.BOOLEAN_DROPDOWN ? DropdownBooleanDecoratorConfig
    : T extends DecoratorTypes.OBJECT ? DefaultObjectDecoratorConfig
    : T extends DecoratorTypes.ARRAY ? EntityArrayDecoratorConfig<Entity>
    : T extends DecoratorTypes.ARRAY_STRING_CHIPS ? StringChipsArrayDecoratorConfig
    : T extends DecoratorTypes.ARRAY_STRING_AUTOCOMPLETE_CHIPS ? AutocompleteStringChipsArrayDecoratorConfig
    : never;