import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BaseEntityType } from '../../../classes/entity.model';
import { DecoratorTypes } from '../../../decorators/base/decorator-types.enum';
import { LodashUtilities } from '../../../encapsulation/lodash.utilities';
import { defaultFalse } from '../../../functions/default-false.function';
import { EntityUtilities } from '../../../utilities/entity.utilities';
import { NgxMatEntityConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { CustomTableConfiguration } from '../../custom-table/custom-table-configuration.model';
import { DisplayColumn, DynamicStyleClasses } from '../../table/table-data';
import { NgxMatEntityBaseInputComponent } from '../base-input.component';

/**
 * The Decorator Types that use the array table class.
 */
type ArrayTableType = DecoratorTypes.ARRAY | DecoratorTypes.ARRAY_DATE
    | DecoratorTypes.ARRAY_DATE_RANGE | DecoratorTypes.ARRAY_DATE_TIME;

/**
 * The base component needed for all arrays that are displayed as a table.
 */
// eslint-disable-next-line angular/prefer-standalone
@Component({
    selector: 'ngx-mat-entity-array-table',
    template: ''
})
export abstract class ArrayTableComponent<ValueType, EntityType extends BaseEntityType<EntityType>, ArrayType extends ArrayTableType>
    extends NgxMatEntityBaseInputComponent<EntityType, ArrayType, ValueType[]> implements OnInit {

    /**
     * The input that should be added to the array.
     */
    input?: ValueType = undefined;
    /**
     * The currently selected values.
     */
    selected: ValueType[] = [];
    /**
     * The configuration of the table.
     */
    tableConfig!: CustomTableConfiguration; // TODO: Make generic type

    override get propertyValue(): ValueType[] {
        return this.entity[this.key] as ValueType[];
    }

    override set propertyValue(value: ValueType[]) {
        (this.entity[this.key] as ValueType[]) = value;
        this.metadata.change?.(this.entity);
    }

    constructor(private readonly dialog: MatDialog, private readonly http: HttpClient) {
        super();
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.propertyValue = this.propertyValue ?? [];
    }

    /**
     * Sets the table config.
     * This is not included in the ngOnInit for child classes to be able to set their metadata.
     * (which is used in the table config).
     */
    protected setTableConfig(): void {
        this.tableConfig = {
            allowClick: defaultFalse,
            displayColumns: this.metadata.displayColumns as DisplayColumn<unknown>[],
            withSelection: !this.isReadOnly,
            dynamicRowStyleClasses: this.metadata.dynamicRowStyleClasses as DynamicStyleClasses<unknown>
        };
    }

    /**
     * Tries to add an item to the array.
     */
    async add(): Promise<void> {
        if (this.input == undefined) {
            return;
        }
        if (!this.metadata.allowDuplicates) {
            for (const value of this.propertyValue) {
                if (await EntityUtilities.isEqual(this.input, value, this.metadata, this.metadata.itemType, this.http)) {
                    this.dialog.open(NgxMatEntityConfirmDialogComponent, {
                        data: this.metadata.duplicatesErrorDialog,
                        autoFocus: false,
                        restoreFocus: false
                    });
                    return;
                }
            }
        }
        this.propertyValue.push(LodashUtilities.cloneDeep(this.input));
        this.propertyValue = [...this.propertyValue];
        this.resetInput();
        this.emitChange();
    }

    /**
     * Is split up from the add method to override this functionality more easily.
     */
    protected resetInput(): void {
        this.input = undefined;
    }

    /**
     * Removes all selected entries from the entity array.
     */
    remove(): void {
        this.propertyValue = this.propertyValue.filter(v => !this.selected.includes(v));
        this.emitChange();
    }
}