/* eslint-disable jsdoc/require-jsdoc */
import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, Inject, OnInit, runInInjectionContext } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DropdownValue } from '../../../../decorators/base/dropdown-value.interface';
import { ReferencesManyDecoratorConfigInternal } from '../../../../decorators/references-many/references-many-decorator-internal.data';
import { LodashUtilities } from '../../../../encapsulation/lodash.utilities';
import { ReflectUtilities } from '../../../../encapsulation/reflect.utilities';
import { defaultFalse } from '../../../../functions/default-false.function';
import { NGX_COMPLETE_GLOBAL_DEFAULT_VALUES, NgxGlobalDefaultValues } from '../../../../global-configuration-values';
import { CustomTableConfiguration } from '../../../custom-table/custom-table-configuration.model';
import { CustomTableComponent } from '../../../custom-table/custom-table.component';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'references-many-input',
    templateUrl: './references-many-input.component.html',
    styleUrls: ['./references-many-input.component.scss'],
    standalone: true,
    imports: [
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        CommonModule,
        MatButtonModule,
        CustomTableComponent
    ]
})
export class ReferencesManyInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.REFERENCES_MANY, string[]> implements OnInit {

    private allReferencedEntities: EntityType[] = [];

    private allDropdownValues: DropdownValue<string>[] = [];
    dropdownValues: DropdownValue<string>[] = [];
    filteredDropdownValues: DropdownValue<string>[] = [];

    input: string = '';

    get currentDropdownValue(): DropdownValue<string> | undefined {
        return LodashUtilities.cloneDeep(this.dropdownValues ?? [])
            .find(v => v.value === this.input);
    }

    get shouldDisplayCurrentValue(): boolean {
        return !!this.currentDropdownValue && !this.filteredDropdownValues.find(v => v.value === this.currentDropdownValue?.value);
    }

    /**
     * The currently selected values.
     */
    selected: string[] = [];
    /**
     * Configuration for the references many table.
     */
    tableConfig!: CustomTableConfiguration;

    override get propertyValue(): string[] {
        return this.entity[this.key] as string[];
    }

    override set propertyValue(value: string[]) {
        (this.entity[this.key] as string[]) = value;
        this.metadata.change?.(this.entity);
    }

    constructor(
        private readonly injector: EnvironmentInjector,
        @Inject(NGX_COMPLETE_GLOBAL_DEFAULT_VALUES)
        private readonly globalConfig: NgxGlobalDefaultValues
    ) {
        super();
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.propertyValue = this.propertyValue ?? [];
        this.metadata = new ReferencesManyDecoratorConfigInternal(this.metadata, this.globalConfig);
        ReflectUtilities.defineMetadata('metadata', this.metadata, this.entity, this.key);

        this.tableConfig = {
            allowClick: defaultFalse,
            displayColumns: this.metadata.displayColumns,
            withSelection: !this.isReadOnly,
            dynamicRowStyleClasses: this.metadata.dynamicRowStyleClasses,
            emptyErrorMessage: this.metadata.emptyErrorMessage,
            resolveToReferencedEntity: (id) => this.metadata.getEntityForId(id as string, this.allReferencedEntities) as EntityType
        };

        void runInInjectionContext(this.injector, async () => {
            this.allReferencedEntities = await this.metadata.getReferencedEntities() as EntityType[];
            this.allDropdownValues = this.metadata.getDropdownValues(LodashUtilities.cloneDeep(this.allReferencedEntities));
            this.dropdownValues = LodashUtilities.cloneDeep(this.allDropdownValues);
            for (const value of this.propertyValue) {
                const foundValue: DropdownValue<string> | undefined = this.dropdownValues.find(v => v.value === value);
                if (foundValue) {
                    this.dropdownValues.splice(this.dropdownValues.indexOf(foundValue), 1);
                }
            }
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
            return option.displayName.toLowerCase().includes(filter) || option.value.toLowerCase().includes(filter);
        });
    }

    add(): void {
        this.propertyValue.push(LodashUtilities.cloneDeep(this.input));
        this.propertyValue = [...this.propertyValue];
        const foundDropdownValue: DropdownValue<string> = this.dropdownValues.find(v => v.value === this.input) as DropdownValue<string>;
        this.dropdownValues.splice(this.dropdownValues.indexOf(foundDropdownValue), 1);
        this.filteredDropdownValues = LodashUtilities.cloneDeep(this.dropdownValues);
        this.input = '';
        this.emitChange();
    }

    addAll(): void {
        this.propertyValue = this.allDropdownValues.map(dv => dv.value);
        this.dropdownValues = [];
        this.filteredDropdownValues = LodashUtilities.cloneDeep(this.dropdownValues);
        this.input = '';
        this.emitChange();
    }

    remove(): void {
        for (const s of this.selected) {
            this.propertyValue.splice(this.propertyValue.indexOf(s), 1);
            const foundDropdownValue: DropdownValue<string> | undefined = this.allDropdownValues.find(v => v.value === s);
            if (foundDropdownValue) {
                this.dropdownValues.push(foundDropdownValue);
            }
        }
        this.propertyValue = [...this.propertyValue];
        this.filteredDropdownValues = LodashUtilities.cloneDeep(this.dropdownValues);
        this.input = '';
        this.emitChange();
    }
}