/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AutocompleteStringChipsArrayDecoratorConfigInternal } from '../../../../decorators/array/array-decorator-internal.data';
import { BaseEntityType } from '../../../../classes/entity.model';
import { LodashUtilities } from '../../../../encapsulation/lodash.utilities';
import { ArrayStringChipsInputComponent } from '../array-string-chips-input/array-string-chips-input.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'array-string-autocomplete-chips',
    templateUrl: './array-string-autocomplete-chips.component.html',
    styleUrls: ['./array-string-autocomplete-chips.component.scss']
})
export class ArrayStringAutocompleteChipsComponent<EntityType extends BaseEntityType<EntityType>>
    extends ArrayStringChipsInputComponent<EntityType> implements OnInit {

    filteredAutocompleteStrings!: string[];

    get autocompleteValues(): string[] {
        return (this.metadata as unknown as AutocompleteStringChipsArrayDecoratorConfigInternal).autocompleteValues;
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.filteredAutocompleteStrings = LodashUtilities.cloneDeep(this.autocompleteValues);
    }

    /**
     * Handles adding a string to the array when an autocomplete value has been selected.
     *
     * @param event - The autocomplete selected event.
     * @param chipsInput - The element where the user typed the value.
     */
    selected(event: MatAutocompleteSelectedEvent, chipsInput: HTMLInputElement): void {
        const value: string = (event.option.viewValue || '').trim();
        this.validateAndSetPropertyValue(value);
        chipsInput.value = '';

        this.emitChange();
    }

    /**
     * Dynamically filters the Autocomplete options when the user inputs something.
     *
     * @param input - The input of the user.
     */
    filterAutocompleteStrings(input: unknown): void {
        const filterValue: string = (input as string).toLowerCase();
        this.filteredAutocompleteStrings = this.autocompleteValues.filter(s => s.toLowerCase().includes(filterValue));
    }
}