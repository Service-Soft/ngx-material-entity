/* eslint-disable jsdoc/require-jsdoc */
import { NgFor, NgIf } from '@angular/common';
import { Component, EnvironmentInjector, OnInit, runInInjectionContext } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { IncludedInValidatorDirective } from '../../../../directives/included-in.directive';
import { LodashUtilities } from '../../../../encapsulation/lodash.utilities';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'string-autocomplete-input',
    templateUrl: './string-autocomplete-input.component.html',
    styleUrls: ['./string-autocomplete-input.component.scss'],
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        FormsModule,
        IncludedInValidatorDirective,
        NgIf,
        NgFor
    ]
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