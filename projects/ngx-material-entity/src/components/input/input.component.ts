import { Component, Input, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { EntityUtilities } from '../../classes/entity-utilities.class';
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

@Component({
    selector: 'ngx-mat-entity-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss']
})
export class NgxMatEntityInputComponent<EntityType extends Entity> implements OnInit {
    /**
     * The entity on which the property exists. Used in conjuction with the "propertyKey"
     * to determine the property for which the input should be generated.
     */
    @Input()
    entity!: EntityType;

    /**
     * The name of the property to generate the input for. Used in conjuction with the "entity".
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

    metadataEntityArray!: EntityArrayDecoratorConfigInternal<Entity>;
    entityArrayValues!: Entity[];
    metadataStringChipsArray!: StringChipsArrayDecoratorConfigInternal;
    stringChipsArrayValues!: string[];
    chipsInput: string = '';

    metadataAutocompleteStringChipsArray!: AutocompleteStringChipsArrayDecoratorConfigInternal;

    readonly DecoratorTypes = DecoratorTypes;

    getWidth = EntityUtilities.getWidth;

    constructor() {}

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

    getObjectProperties(): (keyof Entity)[] {
        const res: (keyof Entity)[] = [];
        for (const property in this.objectProperty) {
            const metadata = EntityUtilities.getPropertyMetadata(
                this.objectProperty,
                property as keyof Entity,
                EntityUtilities.getPropertyType(this.objectProperty, property as keyof Entity)
            );
            if (
                !(this.hideOmitForCreate && metadata.omitForCreate)
                && !(this.hideOmitForEdit && metadata.omitForUpdate)
            ) {
                res.push(property as keyof Entity);
            }
        }
        return res.sort((a, b) => EntityUtilities.compareOrder(a, b, this.objectProperty));
    }

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

    removeStringChipArrayValue(value: string): void {
        this.stringChipsArrayValues.splice(this.stringChipsArrayValues.indexOf(value), 1);
        if (!this.stringChipsArrayValues.length) {
            (this.entity[this.propertyKey] as unknown) = undefined;
            this.stringChipsArrayValues = this.entity[this.propertyKey] as unknown as string[];
        }
    }

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

    filterAutocompleteStrings(input: unknown): void {
        const filterValue = (input as string).toLowerCase();
        this.filteredAutocompleteStrings = this.autocompleteStrings.filter(s => s.toLowerCase().includes(filterValue));
    }
}