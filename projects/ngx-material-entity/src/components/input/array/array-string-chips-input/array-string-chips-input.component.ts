/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { UUIDUtilities } from '../../../../encapsulation/uuid.utilities';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

// eslint-disable-next-line angular/prefer-standalone-component
@Component({
    selector: 'array-string-chips-input',
    templateUrl: './array-string-chips-input.component.html',
    styleUrls: ['./array-string-chips-input.component.scss']
})
export class ArrayStringChipsInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.ARRAY_STRING_CHIPS, string[]> implements OnInit {

    uuid2: string = UUIDUtilities.create();
    chipsInput: string = '';

    /**
     * Handles adding strings to the chipsArray.
     * Checks validation and also creates a new array if it is undefined.
     * This is needed because two things are validated: The array itself
     * and the contents of the array. And we need a way to display an
     * mat-error. As the only validation for the array is whether or not
     * it contains values, we can set it to undefined when the last element is removed
     * (removeStringChipArrayValue). That way we can use the "required" validator.
     * @param event - The event that fires when a new chip is completed.
     */
    addStringChipArrayValue(event: MatChipInputEvent): void {
        const value: string = (event.value || '').trim();
        this.validateAndSetPropertyValue(value);
        event.chipInput?.clear();
        this.chipsInput = '';

        this.emitChange();
    }

    /**
     * Removes the given value from the array.
     * Sets the array to undefined if it is now empty.
     * This is needed because two things are validated: The array itself
     * and the contents of the array. And we need a way to display an
     * mat-error. As the only validation for the array is whether or not
     * it is empty, setting it to undefined here enables us to use the "required" validator.
     * @param value - The string to remove from the array.
     */
    removeStringChipArrayValue(value: string): void {
        this.propertyValue?.splice(this.propertyValue.indexOf(value), 1);
        this.propertyValue = this.propertyValue?.length ? this.propertyValue : undefined;

        this.emitChange();
    }

    protected validateAndSetPropertyValue(value: string): void {
        if (value) {
            if (this.metadata.minLength && value.length < this.metadata.minLength) {
                return;
            }
            if (this.metadata.maxLength && value.length > this.metadata.maxLength) {
                return;
            }
            if (this.metadata.regex && !value.match(this.metadata.regex)) {
                return;
            }
            this.propertyValue = this.propertyValue ?? [];
            this.propertyValue.push(value);
        }
    }
}