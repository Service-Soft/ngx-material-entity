/* eslint-disable jsdoc/require-jsdoc */
import { NgFor } from '@angular/common';
import { Component, EnvironmentInjector, OnInit, runInInjectionContext } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseEntityType } from '../../../../classes/entity.model';
import { AutocompleteStringChipsArrayDecoratorConfigInternal } from '../../../../decorators/array/array-decorator-internal.data';
import { IncludedInValidatorDirective } from '../../../../directives/included-in.directive';
import { LodashUtilities } from '../../../../encapsulation/lodash.utilities';
import { ArrayStringChipsInputComponent } from '../array-string-chips-input/array-string-chips-input.component';
@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'array-string-autocomplete-chips',
    templateUrl: './array-string-autocomplete-chips.component.html',
    styleUrls: ['./array-string-autocomplete-chips.component.scss'],
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatChipsModule,
        FormsModule,
        MatAutocompleteModule,
        IncludedInValidatorDirective,
        MatInputModule,
        NgFor
    ]
})
export class ArrayStringAutocompleteChipsComponent<EntityType extends BaseEntityType<EntityType>>
    extends ArrayStringChipsInputComponent<EntityType> implements OnInit {

    filteredAutocompleteStrings!: string[];
    autocompleteStrings: string[] = [];

    get autocompleteMetadata(): AutocompleteStringChipsArrayDecoratorConfigInternal {
        return this.metadata as unknown as AutocompleteStringChipsArrayDecoratorConfigInternal;
    }

    constructor(private readonly injector: EnvironmentInjector) {
        super();
    }

    override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        await runInInjectionContext(this.injector, async () => {
            this.autocompleteStrings = await this.autocompleteMetadata.autocompleteValues(this.entity);
            this.filteredAutocompleteStrings = LodashUtilities.cloneDeep(this.autocompleteStrings);
        });
    }

    /**
     * Handles adding a string to the array when an autocomplete value has been selected.
     * @param event - The autocomplete selected event.
     * @param chipsInput - The element where the user typed the value.
     * @param model - The model of the string array.
     * @param chipsModel - The model of the single string input.
     */
    selected(event: MatAutocompleteSelectedEvent, chipsInput: HTMLInputElement, model: NgModel, chipsModel: NgModel): void {
        // validation is not needed as selected options are all valid.
        this.propertyValue = this.propertyValue ?? [];
        this.propertyValue.push(event.option.value as string);
        chipsInput.value = '';
        this.chipsInput = '';
        this.filterAutocompleteStrings(this.chipsInput);
        chipsModel.control.updateValueAndValidity();
        model.control.updateValueAndValidity();
        this.setValidationErrors(model, chipsModel);
        this.emitChange();
    }

    /**
     * Dynamically filters the Autocomplete options when the user inputs something.
     * @param input - The input of the user.
     */
    filterAutocompleteStrings(input: string): void {
        const filterValue: string = input.toLowerCase();
        this.filteredAutocompleteStrings = this.autocompleteStrings.filter(s => s.toLowerCase().includes(filterValue));
    }
}