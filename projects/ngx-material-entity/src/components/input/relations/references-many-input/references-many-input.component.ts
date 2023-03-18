/* eslint-disable jsdoc/require-jsdoc */
import { SelectionModel } from '@angular/cdk/collections';
import { Component, EnvironmentInjector, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BaseEntityType } from '../../../../classes/entity.model';
import { SelectionUtilities } from '../../../../classes/selection.utilities';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DropdownValue } from '../../../../decorators/base/dropdown-value.interface';
import { LodashUtilities } from '../../../../encapsulation/lodash.utilities';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'references-many-input',
    templateUrl: './references-many-input.component.html',
    styleUrls: ['./references-many-input.component.scss']
})
export class ReferencesManyInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.REFERENCES_MANY, string[]> implements OnInit {

    allReferencedEntities: EntityType[] = [];

    allDropdownValues: DropdownValue<string>[] = [];

    dropdownValues: DropdownValue<string>[] = [];

    input: string = '';

    referencedEntitiesDataSource: MatTableDataSource<string> = new MatTableDataSource();

    displayedColumns!: string[];

    selection: SelectionModel<string> = new SelectionModel<string>(true, []);

    SelectionUtilities: typeof SelectionUtilities = SelectionUtilities;

    constructor(private readonly injector: EnvironmentInjector) {
        super();
    }

    override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.propertyValue = this.propertyValue ?? [];
        const givenDisplayColumns: string[] = this.metadata.displayColumns.map((v) => v.displayName);
        if (givenDisplayColumns.find(s => s === 'select')) {
            throw new Error(
                `The name "select" for a display column is reserved.
                Please choose a different name.`
            );
        }
        this.displayedColumns = this.isReadOnly ? givenDisplayColumns : ['select'].concat(givenDisplayColumns);
        this.referencedEntitiesDataSource.data = this.propertyValue;

        await this.injector.runInContext(async () => {
            this.allReferencedEntities = await this.metadata.getReferencedEntities() as EntityType[];
        });

        this.allDropdownValues = this.metadata.getDropdownValues(LodashUtilities.cloneDeep(this.allReferencedEntities));
        this.dropdownValues = LodashUtilities.cloneDeep(this.allDropdownValues);
        for (const value of this.propertyValue) {
            const foundValue: DropdownValue<string> | undefined = this.dropdownValues.find(v => v.value === value);
            if (foundValue) {
                this.dropdownValues.splice(this.dropdownValues.indexOf(foundValue), 1);
            }
        }
    }

    async add(): Promise<void> {
        this.propertyValue = this.propertyValue ?? [];
        this.propertyValue.push(LodashUtilities.cloneDeep(this.input));
        const foundDropdownValue: DropdownValue<string> = this.dropdownValues.find(v => v.value === this.input) as DropdownValue<string>;
        this.dropdownValues.splice(this.dropdownValues.indexOf(foundDropdownValue), 1);
        this.referencedEntitiesDataSource.data = this.propertyValue;
        this.input = '';
        this.emitChange();
    }

    addAll(): void {
        this.propertyValue = this.allDropdownValues.map(dv => dv.value);
        this.dropdownValues = [];
        this.referencedEntitiesDataSource.data = this.propertyValue;
        this.input = '';
        this.emitChange();
    }

    remove(): void {
        this.selection.selected.forEach(s => {
            this.propertyValue?.splice(this.propertyValue.indexOf(s), 1);
            const foundDropdownValue: DropdownValue<string> | undefined = this.allDropdownValues.find(v => v.value === s);
            if (foundDropdownValue) {
                this.dropdownValues.push(foundDropdownValue);
            }
        });
        this.referencedEntitiesDataSource.data = this.propertyValue ?? [];
        this.selection.clear();
        this.emitChange();
    }
}