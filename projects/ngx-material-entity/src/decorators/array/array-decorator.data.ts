import { DateFilterFn } from '@angular/material/datepicker';

import { BaseEntityType, EntityClassNewable } from '../../classes/entity.model';
import { ConfirmDialogData } from '../../components/confirm-dialog/confirm-dialog-data';
import { CreateData, DisplayColumn, DynamicStyleClasses } from '../../components/table/table-data';
import { Time } from '../../utilities/date.utilities';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { DropdownValue } from '../base/dropdown-value.interface';
import { PropertyDecoratorConfig } from '../base/property-decorator.data';
import { DateRange } from '../date/date-decorator.data';
import { StringAutocompleteValues } from '../string/string-decorator.data';

/**
 * Base definition for the @array metadata.
 */
export abstract class ArrayDecoratorConfig<ValueType> extends PropertyDecoratorConfig<ValueType> {
    /**
     * The type of the items inside the array.
     */
    itemType!: DecoratorTypes;

    /**
     * Whether or not duplicate values are allowed inside the array.
     * @default false
     */
    allowDuplicates?: boolean;

    /**
     * The error dialog to display when the user tries to add a duplicate entry.
     */
    duplicatesErrorDialog?: ConfirmDialogData;
}

/**
 * Base definition for the @array table metadata.
 */
abstract class ArrayTableDecoratorConfig<ValueType> extends ArrayDecoratorConfig<ValueType[]> {
    /**
     * The definition of the columns to display. Consists of the displayName to show in the header of the row
     * and the value, which is a function that generates the value to display inside a column.
     */
    displayColumns!: DisplayColumn<ValueType>[];

    /**
     * Configuration for css classes that should be applied to table rows based on a condition.
     * This could be used to eg. Set the background color to green when an item has the status completed etc.
     * INFO: You need to use ng-deep or apply the styling in the styles.scss.
     * @default () => []
     */
    dynamicRowStyleClasses?: DynamicStyleClasses<ValueType>;

    /**
     * The error-message to display when the array is required but contains no values.
     */
    missingErrorMessage?: string;

    /**
     * The label for the add button.
     * @default 'Add'
     */
    addButtonLabel?: string;

    /**
     * The label for the remove button.
     * @default 'Remove'
     */
    removeButtonLabel?: string;
}

/**
 * The dialog data for the entities array edit dialog.
 */
export interface EditArrayItemDialogData<EntityType extends BaseEntityType<EntityType>> {
    /**
     * The title of the default edit-dialog.
     */
    title?: (entity: EntityType) => string,
    /**
     * The label on the confirm-button of the default edit-dialog or page. Defaults to "Save".
     */
    confirmButtonLabel?: string,
    /**
     * The label on the cancel-button for the default edit-dialog or page. Defaults to "Cancel".
     */
    cancelButtonLabel?: string
}

/**
 * Definition for an array of Entities.
 */
export interface EntityArrayDecoratorConfig<EntityType extends BaseEntityType<EntityType>> extends ArrayTableDecoratorConfig<EntityType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.OBJECT,

    /**
     * The EntityClass used for generating the create inputs.
     */
    EntityClass: EntityClassNewable<EntityType>,

    /**
     * The data for the add-item-dialog.
     * Can be omitted when adding items inline.
     */
    createDialogData?: CreateData,

    /**
     * The data for the edit-item-dialog.
     * Can be omitted when adding items inline.
     */
    editDialogData?: EditArrayItemDialogData<EntityType>,

    /**
     * Whether or not the form for adding items to the array
     * should be displayed inline.
     * @default true
     */
    createInline?: boolean
}

/**
 * Definition for an array of Dates.
 */
export interface DateArrayDecoratorConfig extends ArrayTableDecoratorConfig<Date> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.DATE,

    /**
     * A function to get the minimum value of the date.
     */
    min?: (date?: Date) => Date,

    /**
     * A function to get the maximum value of the date.
     */
    max?: (date?: Date) => Date,

    /**
     * A filter function to do more specific filtering. This could be the removal of e.g. All weekends.
     */
    filter?: DateFilterFn<Date | null | undefined>
}

/**
 * Definition for an array of DateTimes.
 */
export interface DateTimeArrayDecoratorConfig extends ArrayTableDecoratorConfig<Date> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.DATE_TIME,

    /**
     * The selectable times.
     */
    times?: DropdownValue<Time>[],

    /**
     * The name to use as a label for the time form field.
     * @default 'Time'
     */
    timeDisplayName?: string,

    /**
     * A function to get the minimum value of the date.
     */
    minDate?: (date?: Date) => Date,

    /**
     * A function to get the maximum value of the date.
     */
    maxDate?: (date?: Date) => Date,

    /**
     * A filter function to do more specific date filtering. This could be the removal of e.g. All weekends.
     */
    filterDate?: DateFilterFn<Date | null | undefined>,

    /**
     * A function to get the minimum value of the time.
     */
    minTime?: (date?: Date) => Time,

    /**
     * A function to get the maximum value of the time.
     */
    maxTime?: (date?: Date) => Time,

    /**
     * A filter function to do more specific time filtering. This could be e.g. The removal of lunch breaks.
     */
    filterTime?: ((time: Time) => boolean) | (() => boolean)
}

/**
 * Definition for an array of DateRanges.
 */
export interface DateRangeArrayDecoratorConfig extends ArrayTableDecoratorConfig<DateRange> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.DATE_RANGE,

    /**
     * A function to get the minimum value of the start date.
     */
    minStart?: (date?: Date) => Date,
    /**
     * A function to get the maximum value of the start date.
     */
    maxStart?: (date?: Date) => Date,
    /**
     * A function to get the minimum value of the end date.
     */
    minEnd?: (date?: Date) => Date,
    /**
     * A function to get the maximum value of the end date.
     */
    maxEnd?: (date?: Date) => Date,
    /**
     * A filter function to do more specific filtering on the disallowed end date values. This could be the removal of e.g. All weekends.
     */
    filter?: DateFilterFn<Date>,
    /**
     * The placeholder for the start date of the date range picker.
     * @default "Start"
     */
    placeholderStart?: string,
    /**
     * The placeholder for the end date of the date range picker.
     * @default "End"
     */
    placeholderEnd?: string
}

/**
 * Definition for an array of strings displayed as a chips list.
 */
export interface StringChipsArrayDecoratorConfig extends ArrayDecoratorConfig<string[]> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.STRING,

    /**
     * The class for the <i> tag used to remove an entry from the array.
     * @default 'fas fa-circle-minus'
     */
    deleteIcon?: string,
    /**
     * The minimum required length of the string.
     */
    minLength?: number,
    /**
     * The maximum required length of the string.
     */
    maxLength?: number,
    /**
     * A regex used for validation.
     */
    regex?: RegExp
}

/**
 * Definition for an array of autocomplete strings displayed as a chips list.
 */
export interface AutocompleteStringChipsArrayDecoratorConfig extends ArrayDecoratorConfig<string[]> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.STRING_AUTOCOMPLETE,

    /**
     * The class for the <i> tag used to remove an entry from the array.
     * @default 'fas fa-circle-minus'
     */
    deleteIcon?: string,
    /**
     * The autocomplete values.
     */
    autocompleteValues: StringAutocompleteValues,
    /**
     * The minimum required length of the string.
     */
    minLength?: number,
    /**
     * The maximum required length of the string.
     */
    maxLength?: number,
    /**
     * A regex used for validation.
     */
    regex?: RegExp,
    /**
     * Whether or not valid inputs should be restricted to the autocomplete options.
     * @default false
     */
    restrictToOptions?: boolean
}