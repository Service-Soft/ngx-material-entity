/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BaseEntityType } from '../../../../classes/entity.model';
import { AutocompleteStringChipsArrayDecoratorConfigInternal } from '../../../../decorators/array/array-decorator-internal.data';
import { LodashUtilities } from '../../../../encapsulation/lodash.utilities';
import { ArrayStringChipsInputComponent } from '../array-string-chips-input/array-string-chips-input.component';

// eslint-disable-next-line angular/prefer-standalone-component
@Component({
    selector: 'array-string-autocomplete-chips',
    templateUrl: './array-string-autocomplete-chips.component.html',
    styleUrls: ['./array-string-autocomplete-chips.component.scss']
})
export class ArrayStringAutocompleteChipsComponent<EntityType extends BaseEntityType<EntityType>>
    extends ArrayStringChipsInputComponent<EntityType> implements OnInit {

    filteredAutocompleteStrings!: string[];
    get autocompleteStrings(): string[] {
        return (this.metadata as unknown as AutocompleteStringChipsArrayDecoratorConfigInternal).autocompleteValues;
    }

    get autocompleteMetadata(): AutocompleteStringChipsArrayDecoratorConfigInternal {
        return this.metadata as unknown as AutocompleteStringChipsArrayDecoratorConfigInternal;
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.filteredAutocompleteStrings = LodashUtilities.cloneDeep(this.autocompleteStrings);
    }

    /**
     * Handles adding a string to the array when an autocomplete value has been selected.
     * @param event - The autocomplete selected event.
     * @param chipsInput - The element where the user typed the value.
     */
    selected(event: MatAutocompleteSelectedEvent, chipsInput: HTMLInputElement): void {
        const value: string = (event.option.viewValue || '').trim();
        this.validateAndSetPropertyValue(value);
        chipsInput.value = '';
        this.filterAutocompleteStrings(chipsInput.value);

        this.emitChange();
    }

    /**
     * Dynamically filters the Autocomplete options when the user inputs something.
     * @param input - The input of the user.
     */
    filterAutocompleteStrings(input: unknown): void {
        const filterValue: string = (input as string).toLowerCase();
        this.filteredAutocompleteStrings = this.autocompleteStrings.filter(s => s.toLowerCase().includes(filterValue));
    }
}