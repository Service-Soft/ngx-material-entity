/* eslint-disable jsdoc/require-jsdoc */
import { Component, EnvironmentInjector, OnInit, runInInjectionContext } from '@angular/core';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DropdownValue } from '../../../../decorators/base/dropdown-value.interface';
import { LodashUtilities } from '../../../../encapsulation/lodash.utilities';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

// eslint-disable-next-line angular/prefer-standalone-component
@Component({
    selector: 'number-dropdown-input',
    templateUrl: './number-dropdown-input.component.html',
    styleUrls: ['./number-dropdown-input.component.scss']
})
export class NumberDropdownInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.NUMBER_DROPDOWN, number> implements OnInit {

    private dropdownValues: DropdownValue<number | undefined>[] = [];
    filteredDropdownValues: DropdownValue<number | undefined>[] = [];

    get currentDropdownValue(): DropdownValue<number | undefined> | undefined {
        return LodashUtilities.cloneDeep(this.dropdownValues ?? [])
            .find(v => v.value === this.propertyValue);
    }

    get shouldDisplayCurrentValue(): boolean {
        return !!this.currentDropdownValue && !(!!this.filteredDropdownValues.find(v => v.value === this.currentDropdownValue?.value));
    }

    constructor(private readonly injector: EnvironmentInjector) {
        super();
    }

    override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        await runInInjectionContext(this.injector, async () => {
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
            return option.displayName.toLowerCase().includes(filter) || (`${option.value}`).toLowerCase().includes(filter);
        });
    }
}