/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { LodashUtilities } from '../../../../capsulation/lodash.utilities';
import { BaseEntityType } from '../../../../classes/entity.model';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'string-autocomplete-input',
    templateUrl: './string-autocomplete-input.component.html',
    styleUrls: ['./string-autocomplete-input.component.scss']
})
export class StringAutocompleteInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.STRING_AUTOCOMPLETE> implements OnInit {

    autocompleteStrings!: string[];
    filteredAutocompleteStrings!: string[];

    override ngOnInit(): void {
        super.ngOnInit();
        this.autocompleteStrings = this.metadata.autocompleteValues;
        this.filteredAutocompleteStrings = LodashUtilities.cloneDeep(this.autocompleteStrings);
    }

    /**
     * Dynamically filters the Autocomplete options when the user inputs something.
     *
     * @param input - The input of the user.
     */
    filterAutocompleteStrings(input: unknown): void {
        const inputString = input as string;
        if (inputString) {
            const filterValue = inputString.toLowerCase();
            this.filteredAutocompleteStrings = this.autocompleteStrings.filter(s => s.toLowerCase().includes(filterValue));
        }
    }
}