/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { UUIDUtilities } from '../../../../encapsulation/uuid.utilities';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

// eslint-disable-next-line angular/prefer-standalone-component
@Component({
    // eslint-disable-next-line angular/component-selector
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
     * @param invalid - Whether or not the input is invalid.
     */
    addStringChipArrayValue(event: MatChipInputEvent, invalid: boolean): void {
        if (invalid || !event.value) {
            return;
        }

        const value: string = event.value.trim();
        this.propertyValue = this.propertyValue ?? [];
        this.propertyValue.push(value);

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

    setValidationErrors(model: NgModel, chipsModel: NgModel): void {
        if (chipsModel.errors) {
            model.control.setErrors(chipsModel.errors);
        }
    }
}