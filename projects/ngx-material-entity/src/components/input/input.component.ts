import { Component, Input, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { EntityUtilities } from '../../classes/entity-utilities.class';
import { Entity } from '../../classes/entity-model.class';
import { DecoratorTypes } from '../../decorators/base/decorator-types.enum';
import { PropertyDecoratorConfig } from '../../decorators/base/property-decorator-config.interface';
import { getValidationErrorMessage } from '../get-validation-error-message.function';
import { AutocompleteStringDecoratorConfig, DefaultStringDecoratorConfig, DropdownStringDecoratorConfig, TextboxStringDecoratorConfig } from '../../decorators/string.decorator';
import { DropdownBooleanDecoratorConfig } from '../../decorators/boolean.decorator';
import { DefaultNumberDecoratorConfig, DropdownNumberDecoratorConfig } from '../../decorators/number.decorator';
import { DefaultObjectDecoratorConfig } from '../../decorators/object.decorator';
import { AutocompleteStringChipsArrayDecoratorConfig, EntityArrayDecoratorConfig, StringChipsArrayDecoratorConfig } from '../../decorators/array.decorator';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { cloneDeep } from 'lodash';

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

    metadata!: PropertyDecoratorConfig;

    metadataDefaultString!: DefaultStringDecoratorConfig;
    metadataTextboxString!: TextboxStringDecoratorConfig;
    metadataAutocompleteString!: AutocompleteStringDecoratorConfig;
    autocompleteStrings!: string[];
    filteredAutocompleteStrings!: string[];
    metadataDropdownString!: DropdownStringDecoratorConfig;

    metadataDropdownBoolean!: DropdownBooleanDecoratorConfig;

    metadataDefaultNumber!: DefaultNumberDecoratorConfig;
    metadataDropdownNumber!: DropdownNumberDecoratorConfig;

    metadataDefaultObject!: DefaultObjectDecoratorConfig;
    objectProperty!: Entity;

    metadataEntityArray!: EntityArrayDecoratorConfig<Entity>;
    entityArrayValues!: Entity[];
    metadataStringChipsArray!: StringChipsArrayDecoratorConfig;
    stringChipsArrayValues!: string[];
    chipsInput: string = '';

    metadataAutocompleteStringChipsArray!: AutocompleteStringChipsArrayDecoratorConfig;

    readonly DecoratorTypes = DecoratorTypes;

    getWidth = EntityUtilities.getWidth;

    constructor() {}

    /**
     * Helper method needed to recursively generate property input components (used eg. with the object)
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

        this.metadataDefaultString = this.metadata as DefaultStringDecoratorConfig;
        this.metadataTextboxString = this.metadata as TextboxStringDecoratorConfig;

        this.metadataAutocompleteString = this.metadata as AutocompleteStringDecoratorConfig;
        this.autocompleteStrings = this.metadataAutocompleteString.autocompleteValues;
        this.filteredAutocompleteStrings = cloneDeep(this.autocompleteStrings);

        this.metadataDropdownString = this.metadata as DropdownStringDecoratorConfig;

        this.metadataDropdownBoolean = this.metadata as DropdownBooleanDecoratorConfig;

        this.metadataDefaultNumber = this.metadata as DefaultNumberDecoratorConfig;
        this.metadataDropdownNumber = this.metadata as DropdownNumberDecoratorConfig;

        this.metadataDefaultObject = this.metadata as DefaultObjectDecoratorConfig;
        this.objectProperty = this.entity[this.propertyKey] as unknown as Entity;

        this.metadataEntityArray = this.metadata as EntityArrayDecoratorConfig<Entity>;
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

        this.metadataStringChipsArray = this.metadata as StringChipsArrayDecoratorConfig;
        if (
            this.metadataStringChipsArray.itemType
            && (this.entity[this.propertyKey] as unknown as string[])?.length
        ) {
            this.stringChipsArrayValues = (this.entity[this.propertyKey] as unknown as string[]);
        }

        this.metadataAutocompleteStringChipsArray = this.metadata as AutocompleteStringChipsArrayDecoratorConfig;

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