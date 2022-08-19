/* eslint-disable jsdoc/require-jsdoc */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { EntityUtilities } from '../../../../classes/entity.utilities';
import { AutocompleteStringDecoratorConfigInternal } from '../../../../decorators/string/string-decorator-internal.data';
import { LodashUtilities } from '../../../../capsulation/lodash.utilities';
import { BaseEntityType } from '../../../../classes/entity.model';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'string-autocomplete-input',
    templateUrl: './string-autocomplete-input.component.html',
    styleUrls: ['./string-autocomplete-input.component.scss']
})
export class StringAutocompleteInputComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Output()
    inputChangeEvent = new EventEmitter<void>();

    metadata!: AutocompleteStringDecoratorConfigInternal;

    autocompleteStrings!: string[];
    filteredAutocompleteStrings!: string[];

    constructor() { }

    ngOnInit(): void {
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.key, DecoratorTypes.STRING_AUTOCOMPLETE);
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

    emitChange(): void {
        this.inputChangeEvent.emit();
    }
}