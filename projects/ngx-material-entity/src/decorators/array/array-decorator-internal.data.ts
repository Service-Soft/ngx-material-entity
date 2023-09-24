import { Time } from '@angular/common';
import { DateFilterFn } from '@angular/material/datepicker';
import { BaseEntityType, EntityClassNewable } from '../../classes/entity.model';
import { ConfirmDialogData } from '../../components/confirm-dialog/confirm-dialog-data';
import { CreateDialogData, DisplayColumn } from '../../components/table/table-data';
import { DateUtilities } from '../../utilities/date.utilities';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { DropdownValue } from '../base/dropdown-value.interface';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { DateRange } from '../date/date-decorator.data';
import { ArrayDecoratorConfig, AutocompleteStringChipsArrayDecoratorConfig, DateArrayDecoratorConfig, DateRangeArrayDecoratorConfig, DateTimeArrayDecoratorConfig, EditArrayItemDialogData, EntityArrayDecoratorConfig, StringChipsArrayDecoratorConfig } from './array-decorator.data';

/**
 * The internal dialog data for the entities array edit dialog.
 * Sets default values.
 */
export class EditArrayItemDialogDataInternal<EntityType extends BaseEntityType<EntityType>> implements EditArrayItemDialogData<EntityType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    title: (entity: EntityType) => string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    confirmButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    cancelButtonLabel: string;

    constructor(data?: EditArrayItemDialogData<EntityType>) {
        this.title = data?.title ?? (() => 'Edit');
        this.confirmButtonLabel = data?.confirmButtonLabel ?? 'Save';
        this.cancelButtonLabel = data?.cancelButtonLabel ?? 'Cancel';
    }
}

/**
 * The internal EntityArrayDecoratorConfig. Sets default values.
 */
export class EntityArrayDecoratorConfigInternal<EntityType extends BaseEntityType<EntityType>>
    extends PropertyDecoratorConfigInternal<EntityType[]> implements EntityArrayDecoratorConfig<EntityType> {

    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.OBJECT;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowDuplicates: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    duplicatesErrorDialog: ConfirmDialogData;
    // eslint-disable-next-line jsdoc/require-jsdoc
    EntityClass: EntityClassNewable<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayColumns: DisplayColumn<EntityType>[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    createDialogData?: CreateDialogData;
    // eslint-disable-next-line jsdoc/require-jsdoc
    editDialogData: EditArrayItemDialogDataInternal<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    createInline: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    missingErrorMessage: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    addButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    removeButtonLabel: string;

    constructor(data: EntityArrayDecoratorConfig<EntityType>) {
        super(data);
        this.createInline = data.createInline ?? true;
        this.itemType = data.itemType;
        this.allowDuplicates = data.allowDuplicates ?? false;
        this.duplicatesErrorDialog = getDefaultDuplicateErrorDialogData(data);
        this.EntityClass = data.EntityClass;
        this.displayColumns = data.displayColumns;
        this.createInline = data.createInline ?? true;
        this.missingErrorMessage = data.missingErrorMessage ?? 'Needs to contain at least one value';
        this.defaultWidths = data.defaultWidths ?? [12, 12, 12];
        this.addButtonLabel = data.addButtonLabel ?? 'Add';
        this.removeButtonLabel = data.removeButtonLabel ?? 'Remove';
        this.editDialogData = new EditArrayItemDialogDataInternal(data.editDialogData);
    }
}

/**
 * The internal DateArrayDecoratorConfig. Sets default values.
 */
export class DateArrayDecoratorConfigInternal extends PropertyDecoratorConfigInternal<Date[]> implements DateArrayDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.DATE;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowDuplicates: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    duplicatesErrorDialog: ConfirmDialogData;
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayColumns: DisplayColumn<Date>[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    addButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    removeButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    missingErrorMessage: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    min?: (date?: Date) => Date;
    // eslint-disable-next-line jsdoc/require-jsdoc
    max?: (date?: Date) => Date;
    // eslint-disable-next-line jsdoc/require-jsdoc
    filter?: DateFilterFn<Date | null | undefined>;

    constructor(data: DateArrayDecoratorConfig) {
        super(data);
        this.itemType = data.itemType;
        this.allowDuplicates = data.allowDuplicates ?? false;
        this.duplicatesErrorDialog = getDefaultDuplicateErrorDialogData(data);
        this.displayColumns = data.displayColumns;
        this.defaultWidths = data.defaultWidths ?? [12, 12, 12];
        this.addButtonLabel = data.addButtonLabel ?? 'Add';
        this.removeButtonLabel = data.removeButtonLabel ?? 'Remove';
        this.missingErrorMessage = data.missingErrorMessage ?? 'Needs to contain at least one value';
        this.min = data.min;
        this.max = data.max;
        this.filter = data.filter;
    }
}

/**
 * The internal DateTimeArrayDecoratorConfig. Sets default values.
 */
export class DateTimeArrayDecoratorConfigInternal extends PropertyDecoratorConfigInternal<Date[]> implements DateTimeArrayDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.DATE_TIME;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowDuplicates: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    duplicatesErrorDialog: ConfirmDialogData;
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayColumns: DisplayColumn<Date>[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    addButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    removeButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    missingErrorMessage: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    times: DropdownValue<Time>[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    timeDisplayName: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    minDate?: (date?: Date) => Date;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxDate?: (date?: Date) => Date;
    // eslint-disable-next-line jsdoc/require-jsdoc
    filterDate?: DateFilterFn<Date | null | undefined>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    minTime?: (date?: Date) => Time;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxTime?: (date?: Date) => Time;
    // eslint-disable-next-line jsdoc/require-jsdoc
    filterTime?: ((time: Time) => boolean) | (() => boolean);

    constructor(data: DateTimeArrayDecoratorConfig) {
        super(data);
        this.itemType = data.itemType;
        this.allowDuplicates = data.allowDuplicates ?? false;
        this.duplicatesErrorDialog = getDefaultDuplicateErrorDialogData(data);
        this.displayColumns = data.displayColumns;
        this.defaultWidths = data.defaultWidths ?? [12, 12, 12];
        this.addButtonLabel = data.addButtonLabel ?? 'Add';
        this.removeButtonLabel = data.removeButtonLabel ?? 'Remove';
        this.missingErrorMessage = data.missingErrorMessage ?? 'Needs to contain at least one value';
        this.times = data.times ?? DateUtilities.getDefaultTimes();
        this.timeDisplayName = data.timeDisplayName ?? 'Time';
        this.minDate = data.minDate;
        this.maxDate = data.maxDate;
        this.filterDate = data.filterDate;
        this.minTime = data.minTime;
        this.maxTime = data.maxTime;
        this.filterTime = data.filterTime;
    }
}

/**
 * The internal DateRangeArrayDecoratorConfig. Sets default values.
 */
export class DateRangeArrayDecoratorConfigInternal extends PropertyDecoratorConfigInternal<DateRange[]>
    implements DateRangeArrayDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.DATE_RANGE;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowDuplicates: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    duplicatesErrorDialog: ConfirmDialogData;
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayColumns: DisplayColumn<DateRange>[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    addButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    removeButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    missingErrorMessage: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    placeholderStart: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    placeholderEnd: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    minStart?: (date?: Date) => Date;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxStart?: (date?: Date) => Date;
    // eslint-disable-next-line jsdoc/require-jsdoc
    minEnd?: (date?: Date) => Date;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxEnd?: (date?: Date) => Date;
    // eslint-disable-next-line jsdoc/require-jsdoc
    filter?: DateFilterFn<Date>;

    constructor(data: DateRangeArrayDecoratorConfig) {
        super(data);
        this.itemType = data.itemType;
        this.allowDuplicates = data.allowDuplicates ?? false;
        this.duplicatesErrorDialog = getDefaultDuplicateErrorDialogData(data);
        this.displayColumns = data.displayColumns;
        this.defaultWidths = data.defaultWidths ?? [12, 12, 12];
        this.addButtonLabel = data.addButtonLabel ?? 'Add';
        this.removeButtonLabel = data.removeButtonLabel ?? 'Remove';
        this.missingErrorMessage = data.missingErrorMessage ?? 'Needs to contain at least one value';
        this.placeholderStart = data.placeholderStart ?? 'Start';
        this.placeholderEnd = data.placeholderEnd ?? 'End';
        this.minStart = data.minStart;
        this.maxStart = data.maxStart;
        this.minEnd = data.minEnd;
        this.maxEnd = data.maxEnd;
        this.filter = data.filter;
    }
}

/**
 * The internal StringChipsArrayDecoratorConfig. Sets default values.
 */
export class StringChipsArrayDecoratorConfigInternal extends PropertyDecoratorConfigInternal<string[]>
    implements StringChipsArrayDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.STRING;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowDuplicates: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    duplicatesErrorDialog: ConfirmDialogData;
    // eslint-disable-next-line jsdoc/require-jsdoc
    deleteIcon: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    minLength?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxLength?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    regex?: RegExp;

    constructor(data: StringChipsArrayDecoratorConfig) {
        super(data);
        this.deleteIcon = data.deleteIcon ?? 'fas fa-circle-minus';
        this.itemType = data.itemType;
        this.allowDuplicates = data.allowDuplicates ?? false;
        this.duplicatesErrorDialog = getDefaultDuplicateErrorDialogData(data);
        this.maxLength = data.maxLength;
        this.minLength = data.minLength;
        this.regex = data.regex;
        this.defaultWidths = data.defaultWidths ?? [6, 12, 12];
    }
}

/**
 * The internal AutocompleteStringChipsArrayDecoratorConfig. Sets default values.
 */
export class AutocompleteStringChipsArrayDecoratorConfigInternal
    extends PropertyDecoratorConfigInternal<string[]> implements AutocompleteStringChipsArrayDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    autocompleteValues: string[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.STRING_AUTOCOMPLETE;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowDuplicates: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    duplicatesErrorDialog: ConfirmDialogData;
    // eslint-disable-next-line jsdoc/require-jsdoc
    deleteIcon: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    minLength?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxLength?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    regex?: RegExp;

    constructor(data: AutocompleteStringChipsArrayDecoratorConfig) {
        super(data);
        this.autocompleteValues = data.autocompleteValues;
        this.deleteIcon = data.deleteIcon ?? 'fas fa-circle-minus';
        this.itemType = data.itemType;
        this.allowDuplicates = data.allowDuplicates ?? false;
        this.duplicatesErrorDialog = getDefaultDuplicateErrorDialogData(data);
        this.maxLength = data.maxLength;
        this.minLength = data.minLength;
        this.regex = data.regex;
        this.defaultWidths = data.defaultWidths ?? [6, 12, 12];
    }
}

/**
 * Gets the default dialog data for the error dialog to display when the user tries to add a duplicate value.
 *
 * @param data - The Array Decorator data.
 * @returns The dialog data with set default values.
 */
function getDefaultDuplicateErrorDialogData(data: ArrayDecoratorConfig<unknown[]>): ConfirmDialogData {
    return {
        type: data.duplicatesErrorDialog?.type ?? 'info-only',
        text: data.duplicatesErrorDialog?.text ?? ['Adding duplicate entries to the array is not allowed.'],
        title: data.duplicatesErrorDialog?.title ?? 'Error adding duplicate item',
        confirmButtonLabel: data.duplicatesErrorDialog?.confirmButtonLabel,
        cancelButtonLabel: data.duplicatesErrorDialog?.cancelButtonLabel,
        requireConfirmation: data.duplicatesErrorDialog?.requireConfirmation,
        confirmationText: data.duplicatesErrorDialog?.confirmationText
    };
}