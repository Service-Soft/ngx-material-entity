/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { LodashUtilities } from '../../../../encapsulation/lodash.utilities';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'string-autocomplete-input',
    templateUrl: './string-autocomplete-input.component.html',
    styleUrls: ['./string-autocomplete-input.component.scss']
})
export class StringAutocompleteInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.STRING_AUTOCOMPLETE, string> implements OnInit {

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
    filterAutocompleteStrings(input?: string): void {
        const searchString: string = input ?? '';
        this.filteredAutocompleteStrings = this.autocompleteStrings.filter(s => s.toLowerCase().includes(searchString.toLowerCase()));
    }
}