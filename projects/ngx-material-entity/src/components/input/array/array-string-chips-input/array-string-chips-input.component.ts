/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { BaseEntityType } from '../../../../classes/entity.model';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'array-string-chips-input',
    templateUrl: './array-string-chips-input.component.html',
    styleUrls: ['./array-string-chips-input.component.scss']
})
export class ArrayStringChipsInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.ARRAY_STRING_CHIPS> implements OnInit {

    stringChipsArrayValues?: string[];

    chipsInput: string = '';

    override ngOnInit(): void {
        super.ngOnInit();
        if ((this.entity[this.key] as string[] | undefined)?.length) {
            this.stringChipsArrayValues = (this.entity[this.key] as string[]);
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
            if (this.metadata.minLength && value.length < this.metadata.minLength) {
                return;
            }
            if (this.metadata.maxLength && value.length > this.metadata.maxLength) {
                return;
            }
            if (this.metadata.regex  && !value.match(this.metadata.regex)) {
                return;
            }
            if (!this.stringChipsArrayValues) {
                if (this.entity[this.key] == null) {
                    (this.entity[this.key] as string[]) = [];
                }
                this.stringChipsArrayValues = this.entity[this.key] as string[];
            }
            this.stringChipsArrayValues.push(value);
        }
        event.chipInput?.clear();
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
        this.stringChipsArrayValues?.splice(this.stringChipsArrayValues.indexOf(value), 1);
        if (!this.stringChipsArrayValues?.length) {
            (this.entity[this.key] as unknown) = undefined;
            this.stringChipsArrayValues = this.entity[this.key] as undefined;
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
        if (this.metadata.minLength && value.length < this.metadata.minLength) {
            return;
        }
        if (this.metadata.maxLength && value.length > this.metadata.maxLength) {
            return;
        }
        if (this.metadata.regex  && !value.match(this.metadata.regex)) {
            return;
        }
        if (!this.stringChipsArrayValues) {
            if (this.entity[this.key] == null) {
                (this.entity[this.key] as string[]) = [];
            }
            this.stringChipsArrayValues = this.entity[this.key] as string[];
        }
        this.stringChipsArrayValues.push(value);
        chipsInput.value = '';
    }
}