import { ArrayDecoratorConfig } from '../array.decorator';
import { CheckboxBooleanDecoratorConfig, DropdownBooleanDecoratorConfig } from '../boolean.decorator';
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
    ARRAY = 'array'
}

//TODO Comment
export type DecoratorType<T> =
    T extends DecoratorTypes.STRING ? DefaultStringDecoratorConfig :
    T extends DecoratorTypes.STRING_TEXTBOX ? TextboxStringDecoratorConfig :
    T extends DecoratorTypes.STRING_DROPDOWN ? DropdownStringDecoratorConfig :
    T extends DecoratorTypes.STRING_AUTOCOMPLETE ? AutocompleteStringDecoratorConfig :
    T extends DecoratorTypes.NUMBER ? DefaultNumberDecoratorConfig :
    T extends DecoratorTypes.NUMBER_DROPDOWN ? DropdownNumberDecoratorConfig :
    T extends DecoratorTypes.BOOLEAN_CHECKBOX ? CheckboxBooleanDecoratorConfig :
    T extends DecoratorTypes.BOOLEAN_TOGGLE ? CheckboxBooleanDecoratorConfig :
    T extends DecoratorTypes.BOOLEAN_DROPDOWN ? DropdownBooleanDecoratorConfig :
    T extends DecoratorTypes.OBJECT ? DefaultObjectDecoratorConfig :
    T extends DecoratorTypes.ARRAY ? ArrayDecoratorConfig :
    never;