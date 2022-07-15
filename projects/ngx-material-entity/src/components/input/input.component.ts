import { Component, Input, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { EntityRow, EntityUtilities } from '../../classes/entity-utilities.class';
import { Entity } from '../../classes/entity-model.class';
import { DecoratorTypes } from '../../decorators/base/decorator-types.enum';
import { getValidationErrorMessage } from '../get-validation-error-message.function';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { cloneDeep } from 'lodash';
import { AutocompleteStringChipsArrayDecoratorConfigInternal, EntityArrayDecoratorConfigInternal, StringChipsArrayDecoratorConfigInternal } from '../../decorators/array/array-decorator-internal.data';
import { DropdownBooleanDecoratorConfigInternal } from '../../decorators/boolean/boolean-decorator-internal.data';
import { DefaultNumberDecoratorConfigInternal, DropdownNumberDecoratorConfigInternal } from '../../decorators/number/number-decorator-internal.data';
import { DefaultObjectDecoratorConfigInternal } from '../../decorators/object/object-decorator-internal.data';
import { AutocompleteStringDecoratorConfigInternal, DefaultStringDecoratorConfigInternal, DropdownStringDecoratorConfigInternal, TextboxStringDecoratorConfigInternal } from '../../decorators/string/string-decorator-internal.data';
import { PropertyDecoratorConfigInternal } from '../../decorators/base/property-decorator-internal.data';

/**
 * The default input component. It gets the metadata of the property from the given @Input "entity" and @Input "propertyKey"
 * and displays the input field accordingly.
 *
 * You can also define a method that generates error-messages and if the input should be hidden when its metadata says
 * that it should be omitted for creating or updating.
 * The last part being mostly relevant if you want to use this component inisde an ngFor.
 */
@Component({
    selector: 'ngx-mat-entity-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss']
})
export class NgxMatEntityInputComponent<EntityType extends Entity> implements OnInit {
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
    objectProperty!: Entity;
    objectPropertyRows!: EntityRow<Entity>[];

    metadataEntityArray!: EntityArrayDecoratorConfigInternal<Entity>;
    entityArrayValues!: Entity[];
    metadataStringChipsArray!: StringChipsArrayDecoratorConfigInternal;
    stringChipsArrayValues!: string[];
    chipsInput: string = '';

    metadataAutocompleteStringChipsArray!: AutocompleteStringChipsArrayDecoratorConfigInternal;

    readonly DecoratorTypes = DecoratorTypes;

    getWidth = EntityUtilities.getWidth;

    constructor() {}

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
        this.filteredAutocompleteStrings = cloneDeep(this.autocompleteStrings);

        this.metadataDropdownString = this.metadata as DropdownStringDecoratorConfigInternal;

        this.metadataDropdownBoolean = this.metadata as DropdownBooleanDecoratorConfigInternal;

        this.metadataDefaultNumber = this.metadata as DefaultNumberDecoratorConfigInternal;
        this.metadataDropdownNumber = this.metadata as DropdownNumberDecoratorConfigInternal;

        this.metadataDefaultObject = this.metadata as DefaultObjectDecoratorConfigInternal<EntityType>;
        this.objectProperty = this.entity[this.propertyKey] as unknown as EntityType;
        if (this.metadataDefaultObject.type) {
            this.objectPropertyRows = EntityUtilities.getEntityRows(this.objectProperty, this.hideOmitForCreate, this.hideOmitForEdit);
        }

        this.metadataEntityArray = this.metadata as EntityArrayDecoratorConfigInternal<Entity>;
        if (this.metadataEntityArray.EntityClass) {
            if (!this.entity[this.propertyKey]) {
                (this.entity[this.propertyKey] as unknown as Entity[]) = [];
            }
            this.entityArrayValues = this.entity[this.propertyKey] as unknown as Entity[];
            if (this.metadataEntityArray.createInline === undefined) {
                this.metadataEntityArray.createInline = true;
            }
            if (!this.metadataEntityArray.createInline && !this.metadataEntityArray.createDialogData) {
                this.metadataEntityArray.createDialogData = {
                    title: 'Add'
                }
            }
        }

        this.metadataStringChipsArray = this.metadata as StringChipsArrayDecoratorConfigInternal;
        if (
            this.metadataStringChipsArray.itemType
            && (this.entity[this.propertyKey] as unknown as string[])?.length
        ) {
            this.stringChipsArrayValues = (this.entity[this.propertyKey] as unknown as string[]);
        }

        this.metadataAutocompleteStringChipsArray = this.metadata as AutocompleteStringChipsArrayDecoratorConfigInternal;

        if (!this.getValidationErrorMessage) {
            this.getValidationErrorMessage = getValidationErrorMessage;
        }
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
        const filterValue = (input as string).toLowerCase();
        this.filteredAutocompleteStrings = this.autocompleteStrings.filter(s => s.toLowerCase().includes(filterValue));
    }
}