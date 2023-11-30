/* eslint-disable jsdoc/require-jsdoc */
import { Component, EnvironmentInjector, OnInit, runInInjectionContext } from '@angular/core';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { LodashUtilities } from '../../../../encapsulation/lodash.utilities';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

// eslint-disable-next-line angular/prefer-standalone-component
@Component({
    selector: 'string-autocomplete-input',
    templateUrl: './string-autocomplete-input.component.html',
    styleUrls: ['./string-autocomplete-input.component.scss']
})
export class StringAutocompleteInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.STRING_AUTOCOMPLETE, string> implements OnInit {

    autocompleteStrings: string[] = [];
    filteredAutocompleteStrings!: string[];

    constructor(private readonly injector: EnvironmentInjector) {
        super();
    }

    override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        await runInInjectionContext(this.injector, async () => {
            this.autocompleteStrings = await this.metadata.autocompleteValues(this.entity);
            this.filteredAutocompleteStrings = LodashUtilities.cloneDeep(this.autocompleteStrings);
        });
    }

    /**
     * Dynamically filters the Autocomplete options when the user inputs something.
     * @param input - The input of the user.
     */
    filterAutocompleteStrings(input?: string): void {
        const searchString: string = input ?? '';
        this.filteredAutocompleteStrings = this.autocompleteStrings.filter(s => s.toLowerCase().includes(searchString.toLowerCase()));
        if (!this.filteredAutocompleteStrings.length) {
            this.filteredAutocompleteStrings = LodashUtilities.cloneDeep(this.autocompleteStrings);
        }
    }
}