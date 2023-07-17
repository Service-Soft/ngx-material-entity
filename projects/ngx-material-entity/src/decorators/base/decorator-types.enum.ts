import { AutocompleteStringChipsArrayDecoratorConfigInternal, DateArrayDecoratorConfigInternal, DateRangeArrayDecoratorConfigInternal, DateTimeArrayDecoratorConfigInternal, EntityArrayDecoratorConfigInternal, StringChipsArrayDecoratorConfigInternal } from '../array/array-decorator-internal.data';
import { CheckboxBooleanDecoratorConfigInternal, DropdownBooleanDecoratorConfigInternal, ToggleBooleanDecoratorConfigInternal } from '../boolean/boolean-decorator-internal.data';
import { CustomDecoratorConfigInternal } from '../custom/custom-decorator-internal.data';
import { DateRangeDateDecoratorConfigInternal, DateTimeDateDecoratorConfigInternal, DefaultDateDecoratorConfigInternal } from '../date/date-decorator-internal.data';
import { DefaultFileDecoratorConfigInternal, ImageFileDecoratorConfigInternal } from '../file/file-decorator-internal.data';
import { HasManyDecoratorConfigInternal } from '../has-many/has-many-decorator-internal.data';
import { DefaultNumberDecoratorConfigInternal, DropdownNumberDecoratorConfigInternal, SliderNumberDecoratorConfigInternal } from '../number/number-decorator-internal.data';
import { DefaultObjectDecoratorConfigInternal } from '../object/object-decorator-internal.data';
import { ReferencesManyDecoratorConfigInternal } from '../references-many/references-many-decorator-internal.data';
import { ReferencesOneDecoratorConfigInternal } from '../references-one/references-one-decorator-internal.data';
import { AutocompleteStringDecoratorConfigInternal, DefaultStringDecoratorConfigInternal, DropdownStringDecoratorConfigInternal, PasswordStringDecoratorConfigInternal, TextboxStringDecoratorConfigInternal } from '../string/string-decorator-internal.data';

/**
 * The enum Values for all the different DecoratorTypes.
 */
export enum DecoratorTypes {
    STRING = 'string',
    STRING_DROPDOWN = 'stringDropdown',
    STRING_AUTOCOMPLETE = 'stringAutocomplete',
    STRING_TEXTBOX = 'stringTextbox',
    STRING_PASSWORD = 'stringPassword',
    NUMBER = 'number',
    NUMBER_DROPDOWN = 'numberDropdown',
    NUMBER_SLIDER = 'numberSlider',
    BOOLEAN_CHECKBOX = 'boolean',
    BOOLEAN_TOGGLE = 'booleanToggle',
    BOOLEAN_DROPDOWN = 'booleanDropdown',
    OBJECT = 'object',
    ARRAY = 'array',
    ARRAY_DATE = 'arrayDate',
    ARRAY_DATE_TIME = 'arrayDateTime',
    ARRAY_DATE_RANGE = 'arrayDateRange',
    ARRAY_STRING_CHIPS = 'arrayStringChips',
    ARRAY_STRING_AUTOCOMPLETE_CHIPS = 'arrayStringAutocompleteChips',
    DATE = 'date',
    DATE_RANGE = 'dateRange',
    DATE_TIME = 'dateTime',
    FILE_DEFAULT = 'fileDefault',
    FILE_IMAGE = 'fileImage',
    REFERENCES_MANY = 'referencesMany',
    REFERENCES_ONE = 'referencesOne',
    HAS_MANY = 'hasMany',
    CUSTOM = 'custom'
}

/**
 * Gives the metadata-config Type based on the DecoratorTypes enum.
 */
export type DecoratorType<T, CustomMetadataType extends Record<string, unknown>> =
    T extends DecoratorTypes.STRING ? DefaultStringDecoratorConfigInternal
    : T extends DecoratorTypes.STRING_TEXTBOX ? TextboxStringDecoratorConfigInternal
    : T extends DecoratorTypes.STRING_DROPDOWN ? DropdownStringDecoratorConfigInternal
    : T extends DecoratorTypes.STRING_AUTOCOMPLETE ? AutocompleteStringDecoratorConfigInternal
    : T extends DecoratorTypes.STRING_PASSWORD ? PasswordStringDecoratorConfigInternal
    : T extends DecoratorTypes.NUMBER ? DefaultNumberDecoratorConfigInternal
    : T extends DecoratorTypes.NUMBER_DROPDOWN ? DropdownNumberDecoratorConfigInternal
    : T extends DecoratorTypes.NUMBER_SLIDER ? SliderNumberDecoratorConfigInternal
    : T extends DecoratorTypes.BOOLEAN_CHECKBOX ? CheckboxBooleanDecoratorConfigInternal
    : T extends DecoratorTypes.BOOLEAN_TOGGLE ? ToggleBooleanDecoratorConfigInternal
    : T extends DecoratorTypes.BOOLEAN_DROPDOWN ? DropdownBooleanDecoratorConfigInternal
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    : T extends DecoratorTypes.OBJECT ? DefaultObjectDecoratorConfigInternal<any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    : T extends DecoratorTypes.ARRAY ? EntityArrayDecoratorConfigInternal<any>
    : T extends DecoratorTypes.ARRAY_DATE ? DateArrayDecoratorConfigInternal
    : T extends DecoratorTypes.ARRAY_DATE_TIME ? DateTimeArrayDecoratorConfigInternal
    : T extends DecoratorTypes.ARRAY_DATE_RANGE ? DateRangeArrayDecoratorConfigInternal
    : T extends DecoratorTypes.ARRAY_STRING_CHIPS ? StringChipsArrayDecoratorConfigInternal
    : T extends DecoratorTypes.ARRAY_STRING_AUTOCOMPLETE_CHIPS ? AutocompleteStringChipsArrayDecoratorConfigInternal
    : T extends DecoratorTypes.DATE ? DefaultDateDecoratorConfigInternal
    : T extends DecoratorTypes.DATE_RANGE ? DateRangeDateDecoratorConfigInternal
    : T extends DecoratorTypes.DATE_TIME ? DateTimeDateDecoratorConfigInternal
    : T extends DecoratorTypes.FILE_DEFAULT ? DefaultFileDecoratorConfigInternal
    : T extends DecoratorTypes.FILE_IMAGE ? ImageFileDecoratorConfigInternal
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    : T extends DecoratorTypes.REFERENCES_MANY ? ReferencesManyDecoratorConfigInternal<any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    : T extends DecoratorTypes.REFERENCES_ONE ? ReferencesOneDecoratorConfigInternal<any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    : T extends DecoratorTypes.HAS_MANY ? HasManyDecoratorConfigInternal<any, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    : T extends DecoratorTypes.CUSTOM ? CustomDecoratorConfigInternal<any, any, CustomMetadataType, any>
    : never;