import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { EntityRow, EntityUtilities } from '../../classes/entity.utilities';
import { DecoratorTypes } from '../../decorators/base/decorator-types.enum';
import { getValidationErrorMessage } from '../get-validation-error-message.function';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AutocompleteStringChipsArrayDecoratorConfigInternal, DateArrayDecoratorConfigInternal, DateRangeArrayDecoratorConfigInternal, DateTimeArrayDecoratorConfigInternal, EntityArrayDecoratorConfigInternal, StringChipsArrayDecoratorConfigInternal } from '../../decorators/array/array-decorator-internal.data';
import { DropdownBooleanDecoratorConfigInternal } from '../../decorators/boolean/boolean-decorator-internal.data';
import { DefaultNumberDecoratorConfigInternal, DropdownNumberDecoratorConfigInternal } from '../../decorators/number/number-decorator-internal.data';
import { DefaultObjectDecoratorConfigInternal } from '../../decorators/object/object-decorator-internal.data';
import { AutocompleteStringDecoratorConfigInternal, DefaultStringDecoratorConfigInternal, DropdownStringDecoratorConfigInternal, TextboxStringDecoratorConfigInternal } from '../../decorators/string/string-decorator-internal.data';
import { PropertyDecoratorConfigInternal } from '../../decorators/base/property-decorator-internal.data';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AddArrayItemDialogDataBuilder, AddArrayItemDialogDataInternal } from './add-array-item-dialog-data.builder';
import { AddArrayItemDialogData } from './add-array-item-dialog-data';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DateRangeDateDecoratorConfigInternal, DateTimeDateDecoratorConfigInternal, DefaultDateDecoratorConfigInternal } from '../../decorators/date/date-decorator-internal.data';
import { DateUtilities } from '../../classes/date.utilities';
import { DateFilterFn } from '@angular/material/datepicker';
import { DateRange } from '../../decorators/date/date-decorator.data';
import { Time } from '@angular/common';
import { DropdownValue } from '../../decorators/base/dropdown-value.interface';
import { LodashUtilities } from '../../capsulation/lodash.utilities';
import { NgxMatEntityConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

/**
 * The default input component. It gets the metadata of the property from the given @Input "entity" and @Input "propertyKey"
 * and displays the input field accordingly.
 *
 * You can also define a method that generates error-messages and if the input should be hidden when its metadata says
 * that it should be omitted for creating or updating.
 * The last part being mostly relevant if you want to use this component inside an ngFor.
 */
@Component({
    selector: 'ngx-mat-entity-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss']
})
export class NgxMatEntityInputComponent<EntityType extends object> implements OnInit {
    /**
     * The entity on which the property exists. Used in conjunction with the "propertyKey"
     * to determine the property for which the input should be generated.
     */
    @Input()
    entity!: EntityType;

    /**
     * The name of the property to generate the input for. Used in conjunction with the "entity".
     */
    @Input()
    propertyKey!: keyof EntityType;

    /**
     * (optional) A custom function to generate the error-message for invalid inputs.
     */
    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    /**
     * Whether to hide a value if it is omitted for creation.
     * Is used internally for the object property.
     */
    @Input()
    hideOmitForCreate?: boolean;

    /**
     * Whether to hide a value if it is omitted for editing.
     * Is used internally for the object property.
     */
    @Input()
    hideOmitForEdit?: boolean;

    @ViewChild('addArrayItemDialog')
    addArrayItemDialog!: TemplateRef<unknown>;
    addArrayItemDialogRef!: MatDialogRef<unknown>;

    type!: DecoratorTypes;

    metadata!: PropertyDecoratorConfigInternal;

    metadataDefaultString!: DefaultStringDecoratorConfigInternal;
    metadataTextboxString!: TextboxStringDecoratorConfigInternal;
    metadataAutocompleteString!: AutocompleteStringDecoratorConfigInternal;
    autocompleteStrings!: string[];
    filteredAutocompleteStrings!: string[];
    metadataDropdownString!: DropdownStringDecoratorConfigInternal;

    metadataDropdownBoolean!: DropdownBooleanDecoratorConfigInternal;

    metadataDefaultNumber!: DefaultNumberDecoratorConfigInternal;
    metadataDropdownNumber!: DropdownNumberDecoratorConfigInternal;

    metadataDefaultObject!: DefaultObjectDecoratorConfigInternal<EntityType>;
    objectProperty!: EntityType;
    objectPropertyRows!: EntityRow<EntityType>[];

    metadataEntityArray!: EntityArrayDecoratorConfigInternal<EntityType>;
    entityArrayValues!: EntityType[];
    arrayItem!: EntityType;
    private arrayItemPriorChanges!: EntityType;
    arrayItemInlineRows!: EntityRow<EntityType>[];
    dataSource!: MatTableDataSource<EntityType>;
    selection: SelectionModel<EntityType> = new SelectionModel<EntityType>(true, []);
    displayedColumns!: string[];

    metadataDateArray!: DateArrayDecoratorConfigInternal;
    dateArrayValues!: Date[];
    dateInput?: Date = undefined;
    dateDataSource!: MatTableDataSource<Date>;
    dateSelection: SelectionModel<Date> = new SelectionModel<Date>(true, []);

    metadataDateTimeArray!: DateTimeArrayDecoratorConfigInternal;

    metadataDateRangeArray!: DateRangeArrayDecoratorConfigInternal;
    dateRangeArrayValues!: DateRange[];
    dateRangeDataSource!: MatTableDataSource<DateRange>;
    dateRangeSelection: SelectionModel<DateRange> = new SelectionModel<DateRange>(true, []);

    metadataStringChipsArray!: StringChipsArrayDecoratorConfigInternal;
    stringChipsArrayValues!: string[];
    chipsInput: string = '';

    metadataAutocompleteStringChipsArray!: AutocompleteStringChipsArrayDecoratorConfigInternal;

    metadataDefaultDate!: DefaultDateDecoratorConfigInternal;
    metadataDateRangeDate!: DateRangeDateDecoratorConfigInternal;
    metadataDateTimeDate!: DateTimeDateDecoratorConfigInternal;

    dateRange!: DateRange;
    dateRangeStart!: Date;
    dateRangeEnd!: Date;

    dateTime!: Date;
    time!: Time;
    timeDropdownValues!: DropdownValue<Time>[];

    dialogInputData!: AddArrayItemDialogData<EntityType>;
    dialogData!: AddArrayItemDialogDataInternal<EntityType>;
    arrayItemDialogRows!: EntityRow<EntityType>[];

    readonly DecoratorTypes = DecoratorTypes;

    EntityUtilities = EntityUtilities;
    DateUtilities = DateUtilities;

    constructor(
        private readonly dialog: MatDialog
    ) {}

    defaultDateFilter: DateFilterFn<Date | null | undefined> = (): boolean => true;

    /**
     * This is needed for the inputs to work inside an ngFor.
     *
     * @param index - The index of the element in the ngFor.
     * @returns The index.
     */
    trackByFn(index: unknown): unknown {
        return index;
    }

    ngOnInit(): void {
        if (!this.entity) {
            throw new Error('Missing required Input data "entity"');
        }
        if (!this.propertyKey) {
            throw new Error('Missing required Input data "propertyKey"');
        }
        this.type = EntityUtilities.getPropertyType(this.entity, this.propertyKey);
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.propertyKey, this.type);

        this.metadataDefaultString = this.metadata as DefaultStringDecoratorConfigInternal;
        this.metadataTextboxString = this.metadata as TextboxStringDecoratorConfigInternal;

        this.metadataAutocompleteString = this.metadata as AutocompleteStringDecoratorConfigInternal;
        this.autocompleteStrings = this.metadataAutocompleteString.autocompleteValues;
        this.filteredAutocompleteStrings = LodashUtilities.cloneDeep(this.autocompleteStrings);

        this.metadataDropdownString = this.metadata as DropdownStringDecoratorConfigInternal;

        this.metadataDropdownBoolean = this.metadata as DropdownBooleanDecoratorConfigInternal;
        if (
            (this.type === DecoratorTypes.BOOLEAN_CHECKBOX || this.type === DecoratorTypes.BOOLEAN_TOGGLE)
            && this.entity[this.propertyKey] === undefined
        ) {
            (this.entity[this.propertyKey] as unknown as boolean) = false;
        }

        this.metadataDefaultNumber = this.metadata as DefaultNumberDecoratorConfigInternal;
        this.metadataDropdownNumber = this.metadata as DropdownNumberDecoratorConfigInternal;

        this.metadataDefaultObject = this.metadata as DefaultObjectDecoratorConfigInternal<EntityType>;
        this.objectProperty = this.entity[this.propertyKey] as unknown as EntityType;
        if (this.type === DecoratorTypes.OBJECT) {
            this.objectPropertyRows = EntityUtilities.getEntityRows(this.objectProperty, this.hideOmitForCreate, this.hideOmitForEdit);
        }

        this.metadataEntityArray = this.metadata as EntityArrayDecoratorConfigInternal<EntityType>;
        if (this.type === DecoratorTypes.ARRAY) {
            if (!this.entity[this.propertyKey]) {
                (this.entity[this.propertyKey] as unknown as EntityType[]) = [];
            }
            this.entityArrayValues = this.entity[this.propertyKey] as unknown as EntityType[];
            if (!this.metadataEntityArray.createInline && !this.metadataEntityArray.createDialogData) {
                this.metadataEntityArray.createDialogData = {
                    title: 'Add'
                }
            }
            const givenDisplayColumns: string[] = this.metadataEntityArray.displayColumns.map((v) => v.displayName);
            if (givenDisplayColumns.find(s => s === 'select')) {
                throw new Error(
                    `The name "select" for a display column is reserved.
                    Please choose a different name.`
                );
            }
            this.displayedColumns = ['select'].concat(givenDisplayColumns);
            this.dataSource = new MatTableDataSource();
            this.dataSource.data = this.entityArrayValues;
            this.arrayItem = new this.metadataEntityArray.EntityClass();
            this.arrayItemInlineRows = EntityUtilities.getEntityRows(
                this.arrayItem,
                this.hideOmitForCreate === false ? false : true,
                this.hideOmitForEdit ? true : false
            );
            this.arrayItemPriorChanges = LodashUtilities.cloneDeep(this.arrayItem);

            this.dialogInputData = {
                entity: this.arrayItem,
                createDialogData: this.metadataEntityArray.createDialogData,
                getValidationErrorMessage: this.getValidationErrorMessage
            }
            this.dialogData = new AddArrayItemDialogDataBuilder(this.dialogInputData).getResult();
            this.arrayItemDialogRows = EntityUtilities.getEntityRows(this.dialogData.entity, true);
        }

        this.metadataStringChipsArray = this.metadata as StringChipsArrayDecoratorConfigInternal;
        if (
            (this.type === DecoratorTypes.ARRAY_STRING_CHIPS || this.type === DecoratorTypes.ARRAY_STRING_AUTOCOMPLETE_CHIPS)
            && (this.entity[this.propertyKey] as unknown as string[])?.length
        ) {
            this.stringChipsArrayValues = (this.entity[this.propertyKey] as unknown as string[]);
        }

        this.metadataDateArray = this.metadata as DateArrayDecoratorConfigInternal;
        if (this.type === DecoratorTypes.ARRAY_DATE) {
            if (!this.entity[this.propertyKey]) {
                (this.entity[this.propertyKey] as unknown as Date[]) = [];
            }
            this.dateArrayValues = this.entity[this.propertyKey] as unknown as Date[];
            const givenDisplayColumns: string[] = this.metadataDateArray.displayColumns.map((v) => v.displayName);
            if (givenDisplayColumns.find(s => s === 'select')) {
                throw new Error(
                    `The name "select" for a display column is reserved.
                    Please choose a different name.`
                );
            }
            this.displayedColumns = ['select'].concat(givenDisplayColumns);
            this.dateDataSource = new MatTableDataSource();
            this.dateDataSource.data = this.dateArrayValues;
        }

        this.metadataDateTimeArray = this.metadata as DateTimeArrayDecoratorConfigInternal;
        if (this.type === DecoratorTypes.ARRAY_DATE_TIME) {
            if (!this.entity[this.propertyKey]) {
                (this.entity[this.propertyKey] as unknown as Date[]) = [];
            }
            this.dateArrayValues = this.entity[this.propertyKey] as unknown as Date[];
            const givenDisplayColumns: string[] = this.metadataDateArray.displayColumns.map((v) => v.displayName);
            if (givenDisplayColumns.find(s => s === 'select')) {
                throw new Error(
                    `The name "select" for a display column is reserved.
                    Please choose a different name.`
                );
            }
            this.displayedColumns = ['select'].concat(givenDisplayColumns);
            this.dateDataSource = new MatTableDataSource();
            this.dateDataSource.data = this.dateArrayValues;

            this.time = DateUtilities.getTimeFromDate(this.entity[this.propertyKey] as unknown as Date);
            this.timeDropdownValues = this.metadataDateTimeArray.times;
            if (this.entity[this.propertyKey]) {
                this.dateTime = new Date(this.entity[this.propertyKey] as unknown as Date);
            }
        }

        this.metadataDateRangeArray = this.metadata as DateRangeArrayDecoratorConfigInternal;
        if (this.type === DecoratorTypes.ARRAY_DATE_RANGE) {
            if (!this.entity[this.propertyKey]) {
                (this.entity[this.propertyKey] as unknown as DateRange[]) = [];
            }
            this.dateRangeArrayValues = this.entity[this.propertyKey] as unknown as DateRange[];
            const givenDisplayColumns: string[] = this.metadataDateRangeArray.displayColumns.map((v) => v.displayName);
            if (givenDisplayColumns.find(s => s === 'select')) {
                throw new Error(
                    `The name "select" for a display column is reserved.
                    Please choose a different name.`
                );
            }
            this.displayedColumns = ['select'].concat(givenDisplayColumns);
            this.dateRangeDataSource = new MatTableDataSource();
            this.dateRangeDataSource.data = this.dateRangeArrayValues;

            this.dateRange = {
                start: undefined as unknown as Date,
                end: undefined as unknown as Date,
                values: undefined
            }
        }

        this.metadataAutocompleteStringChipsArray = this.metadata as AutocompleteStringChipsArrayDecoratorConfigInternal;

        if (!this.getValidationErrorMessage) {
            this.getValidationErrorMessage = getValidationErrorMessage;
        }

        this.metadataDefaultDate = this.metadata as DefaultDateDecoratorConfigInternal;
        this.metadataDateRangeDate = this.metadata as DateRangeDateDecoratorConfigInternal;
        this.metadataDateTimeDate = this.metadata as DateTimeDateDecoratorConfigInternal;

        if (this.type === DecoratorTypes.DATE_RANGE) {
            this.dateRange = LodashUtilities.cloneDeep(this.entity[this.propertyKey] as unknown as DateRange);
            if (!this.dateRange) {
                this.dateRange = {
                    start: undefined as unknown as Date,
                    end: undefined as unknown as Date,
                    values: undefined
                }
            }
            this.dateRangeStart = new Date(this.dateRange.start);
            this.dateRangeEnd = new Date(this.dateRange.end);
            this.setDateRangeValues();
        }

        if (this.type === DecoratorTypes.DATE_TIME) {
            this.time = DateUtilities.getTimeFromDate(this.entity[this.propertyKey] as unknown as Date);
            this.timeDropdownValues = this.metadataDateTimeDate.times;
            if (this.entity[this.propertyKey]) {
                this.dateTime = new Date(this.entity[this.propertyKey] as unknown as Date);
            }
        }
    }

    /**
     * Checks if the time object has valid hours and minutes properties.
     * Doesn't check custom validators from the metadata configuration.
     *
     * @returns Whether or not the time object is valid.
     */
    timeIsInvalid(): boolean {
        if (
            !this.time
            || this.time.hours == null
            || typeof this.time.hours !== 'number'
            || Number.isNaN(this.time.hours)
            || this.time.minutes == null
            || typeof this.time.minutes !== 'number'
            || Number.isNaN(this.time.minutes)
        ) {
            return true;
        }
        return false;
    }

    /**
     * Checks if two times are equal. Is needed for the dropdown.
     *
     * @param time1 - The first time to compare.
     * @param time2 - The second time to compare.
     * @returns Whether or not the time objects are the same.
     */
    compareTimes(time1: Time, time2: Time): boolean {
        return time1 && time2 && time1.hours === time2.hours && time1.minutes === time2.minutes;
    }

    /**
     * Updates the date range values based on the start and end date.
     */
    setDateRangeValues(): void {
        if (this.dateRangeStart && this.dateRangeEnd) {
            this.dateRange.start = new Date(this.dateRangeStart);
            this.dateRange.end = new Date(this.dateRangeEnd);
            const values: Date[] = DateUtilities.getDatesBetween(
                new Date(this.dateRange.start),
                new Date(this.dateRange.end),
                this.metadataDateRangeDate.filter
            );
            this.dateRange.values = values.length ? values : undefined;
        }
        else {
            this.dateRange.values = undefined;
        }
        this.entity[this.propertyKey] = this.dateRange as unknown as EntityType[keyof EntityType]
    }

    /**
     * Sets the time on a datetime property.
     */
    setTime(): void {
        if (!this.dateTime) {
            this.entity[this.propertyKey] = undefined as unknown as EntityType[keyof EntityType];
            return;
        }
        this.entity[this.propertyKey] = new Date(this.dateTime) as unknown as EntityType[keyof EntityType];
        if (this.time?.hours != null && this.time?.minutes != null) {
            (this.entity[this.propertyKey] as unknown as Date).setHours(this.time.hours, this.time.minutes, 0, 0);
        }
        else {
            (this.entity[this.propertyKey] as unknown as Date).setHours(0, 0, 0, 0);
        }
    }

    /**
     * Tries to add an item to the entity array.
     * Does this either inline if the "createInline"-metadata is set to true
     * or in a separate dialog if it is set to false.
     */
    addEntity(): void {
        if (this.metadataEntityArray.createInline) {
            this.add(this.arrayItem, this.entityArrayValues, this.dataSource);
        }
        else {
            this.addArrayItemDialogRef = this.dialog.open(
                this.addArrayItemDialog,
                {
                    data: this.dialogData,
                    autoFocus: false,
                    restoreFocus: false
                }
            )
        }
    }

    /**
     * Adds a date time to the array.
     */
    addDateTime(): void {
        const input = new Date(this.dateInput as Date);
        input.setHours(this.time.hours, this.time.minutes, 0, 0);
        this.add(input, this.dateArrayValues, this.dateDataSource);
    }

    /**
     * Adds a DateRange to the array.
     */
    addDateRange(): void {
        this.dateRange.start = new Date(this.dateRangeStart);
        this.dateRange.end = new Date(this.dateRangeEnd);
        const values: Date[] = DateUtilities.getDatesBetween(
            new Date(this.dateRange.start),
            new Date(this.dateRange.end),
            this.metadataDateRangeDate.filter
        );
        this.dateRange.values = values.length ? values : undefined;
        this.add(this.dateRange, this.dateRangeArrayValues, this.dateRangeDataSource);
    }

    /**
     * Tries to add an item to the array.
     *
     * @param inputValue - The value that should be added to the array.
     * @param values - All values of the dataSource.
     * @param dataSource - The dataSource itself.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    add(inputValue: any, values: any[], dataSource: MatTableDataSource<any>): void {
        if (inputValue) {
            if (
                !this.metadataDateArray.allowDuplicates
                && values.find(v => EntityUtilities.isEqual(inputValue, v, this.metadata, this.metadataDateArray.itemType))
            ) {
                this.dialog.open(NgxMatEntityConfirmDialogComponent, {
                    data: this.metadataDateArray.duplicatesErrorDialog,
                    autoFocus: false,
                    restoreFocus: false
                });
                return;
            }
            values.push(LodashUtilities.cloneDeep(inputValue));
            dataSource.data = values;
            if (this.type === DecoratorTypes.ARRAY) {
                EntityUtilities.resetChangesOnEntity(this.arrayItem, this.arrayItemPriorChanges);
            }
            else {
                this.dateInput = undefined;
                this.time = undefined as unknown as Time;
            }
        }
    }

    /**
     * Adds the array item defined in the dialog.
     */
    addArrayItem(): void {
        this.addArrayItemDialogRef.close();
        this.entityArrayValues.push(LodashUtilities.cloneDeep(this.arrayItem));
        this.dataSource.data = this.entityArrayValues;
        EntityUtilities.resetChangesOnEntity(this.arrayItem, this.arrayItemPriorChanges);
    }

    /**
     * Cancels adding the array item defined in the dialog.
     */
    cancelAddArrayItem(): void {
        this.addArrayItemDialogRef.close();
        EntityUtilities.resetChangesOnEntity(this.arrayItem, this.arrayItemPriorChanges);
    }

    /**
     * Removes all selected entries from the entity array.
     *
     * @param selection - The selection containing the items to remove.
     * @param values - The values of the dataSource.
     * @param dataSource - The dataSource.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    remove(selection: SelectionModel<any>, values: any[], dataSource: MatTableDataSource<any>): void {
        selection.selected.forEach(s => {
            values.splice(values.indexOf(s), 1);
        });
        dataSource.data = values;
        selection.clear();
    }

    /**
     * Toggles all array-items in the table.
     *
     * @param selection - The selection to toggle.
     * @param dataSource - The dataSource of the selection.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    masterToggle(selection: SelectionModel<any>, dataSource: MatTableDataSource<any>): void {
        if (this.isAllSelected(selection, dataSource)) {
            selection.clear();
        }
        else {
            dataSource.data.forEach(row => selection.select(row));
        }
    }

    /**
     * Checks if all array-items in the table have been selected.
     * This is needed to display the "masterToggle"-checkbox correctly.
     *
     * @param selection - The selection to check.
     * @param dataSource - The dataSource of the selection.
     * @returns Whether or not all array-items in the table have been selected.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isAllSelected(selection: SelectionModel<any>, dataSource: MatTableDataSource<any>): boolean {
        const numSelected = selection.selected.length;
        const numRows = dataSource.data.length;
        return numSelected === numRows;
    }

    /**
     * Handles adding strings to the chipsArray.
     * Checks validation and also creates a new array if it is undefined.
     * This is needed because two things are validated: The array itself
     * and the contents of the array. And we need a way to display an
     * mat-error. As the only validation for the array is whether or not
     * it contains values, we can set it to undefined when the last element is removed
     * (removeStringChipArrayValue). That way we can use the "required" validator.
     *
     * @param event - The event that fires when a new chip is completed.
     */
    addStringChipArrayValue(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (value) {
            if (this.metadataStringChipsArray.minLength && value.length < this.metadataStringChipsArray.minLength) {
                return;
            }
            if (this.metadataStringChipsArray.maxLength && value.length > this.metadataStringChipsArray.maxLength) {
                return;
            }
            if (this.metadataStringChipsArray.regex  && !value.match(this.metadataStringChipsArray.regex)) {
                return;
            }
            if (!this.stringChipsArrayValues) {
                if (!this.entity[this.propertyKey] as unknown as string[]) {
                    (this.entity[this.propertyKey] as unknown as string[]) = [];
                }
                this.stringChipsArrayValues = this.entity[this.propertyKey] as unknown as string[];
            }
            this.stringChipsArrayValues.push(value);
        }
        event.chipInput!.clear();
    }

    /**
     * Removes the given value from the array.
     * Sets the array to undefined if it is now empty.
     * This is needed because two things are validated: The array itself
     * and the contents of the array. And we need a way to display an
     * mat-error. As the only validation for the array is whether or not
     * it is empty, setting it to undefined here enables us to use the "required" validator.
     *
     * @param value - The string to remove from the array.
     */
    removeStringChipArrayValue(value: string): void {
        this.stringChipsArrayValues.splice(this.stringChipsArrayValues.indexOf(value), 1);
        if (!this.stringChipsArrayValues.length) {
            (this.entity[this.propertyKey] as unknown) = undefined;
            this.stringChipsArrayValues = this.entity[this.propertyKey] as unknown as string[];
        }
    }

    /**
     * Handles adding a string to the array when an autocomplete value has been selected.
     *
     * @param event - The autocomplete selected event.
     * @param chipsInput - The element where the user typed the value.
     */
    selected(event: MatAutocompleteSelectedEvent, chipsInput: HTMLInputElement): void {
        const value = (event.option.viewValue || '').trim();
        if (this.metadataStringChipsArray.minLength && value.length < this.metadataStringChipsArray.minLength) {
            return;
        }
        if (this.metadataStringChipsArray.maxLength && value.length > this.metadataStringChipsArray.maxLength) {
            return;
        }
        if (this.metadataStringChipsArray.regex  && !value.match(this.metadataStringChipsArray.regex)) {
            return;
        }
        if (!this.stringChipsArrayValues) {
            if (!this.entity[this.propertyKey] as unknown as string[]) {
                (this.entity[this.propertyKey] as unknown as string[]) = [];
            }
            this.stringChipsArrayValues = this.entity[this.propertyKey] as unknown as string[];
        }
        this.stringChipsArrayValues.push(value);
        chipsInput.value = '';
    }

    /**
     * Dynamically filters the Autocomplete options when the user inputs something.
     *
     * @param input - The input of the user.
     */
    filterAutocompleteStrings(input: unknown): void {
        if (input) {
            const filterValue = (input as string).toLowerCase();
            this.filteredAutocompleteStrings = this.autocompleteStrings.filter(s => s.toLowerCase().includes(filterValue));
        }
    }
}