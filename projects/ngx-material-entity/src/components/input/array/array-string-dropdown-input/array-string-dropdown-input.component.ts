/* eslint-disable jsdoc/require-jsdoc */
import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, OnInit, runInInjectionContext } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DropdownValue } from '../../../../decorators/base/dropdown-value.interface';
import { LodashUtilities } from '../../../../encapsulation/lodash.utilities';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'array-string-dropdown-input',
    templateUrl: './array-string-dropdown-input.component.html',
    styleUrls: ['./array-string-dropdown-input.component.scss'],
    standalone: true,
    imports: [
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        CommonModule,
        FaIconComponent
    ]
})
export class ArrayStringDropdownInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.ARRAY_STRING_DROPDOWN, string[]> implements OnInit {

    faSearch: IconDefinition = faSearch;

    private dropdownValues: DropdownValue<string>[] = [];
    filteredDropdownValues: DropdownValue<string>[] = [];

    constructor(private readonly injector: EnvironmentInjector) {
        super();
    }

    shouldDisplayCurrentValue(value: string): boolean {
        return !this.filteredDropdownValues.find(v => v.value === value);
    }

    getDisplayNameForValue(value: string): string | undefined {
        const currentDropdownValues: DropdownValue<string>[] = LodashUtilities.cloneDeep(this.dropdownValues)
            // eslint-disable-next-line typescript/strict-boolean-expressions
            .filter(v => this.propertyValue?.includes(v.value));
        return currentDropdownValues.find(v => v.value === value)?.displayName;
    }

    override ngOnInit(): void {
        super.ngOnInit();
        void runInInjectionContext(this.injector, async () => {
            this.dropdownValues = await this.metadata.dropdownValues(this.entity);
            this.filteredDropdownValues = LodashUtilities.cloneDeep(this.dropdownValues);
        });
    }

    /**
     * Filters the dropdown values.
     * @param searchInput - The search input to filter for.
     */
    filterDropdownValues(searchInput: string): void {
        const filter: string = searchInput.toLowerCase();
        this.filteredDropdownValues = LodashUtilities.cloneDeep(this.dropdownValues).filter(option => {
            return option.displayName.toLowerCase().includes(filter) || option.value?.toLowerCase().includes(filter);
        });
    }
}