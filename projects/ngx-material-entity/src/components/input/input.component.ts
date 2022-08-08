import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { EntityRow, EntityUtilities } from '../../classes/entity.utilities';
import { DecoratorTypes } from '../../decorators/base/decorator-types.enum';
import { getValidationErrorMessage } from '../get-validation-error-message.function';
import { EntityArrayDecoratorConfigInternal } from '../../decorators/array/array-decorator-internal.data';
import { DefaultObjectDecoratorConfigInternal } from '../../decorators/object/object-decorator-internal.data';
import { PropertyDecoratorConfigInternal } from '../../decorators/base/property-decorator-internal.data';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AddArrayItemDialogDataBuilder, AddArrayItemDialogDataInternal } from './add-array-item-dialog-data.builder';
import { AddArrayItemDialogData } from './add-array-item-dialog-data';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DateUtilities } from '../../classes/date.utilities';
import { LodashUtilities } from '../../capsulation/lodash.utilities';
import { NgxMatEntityConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

/**
 * The default input component. It gets the metadata of the property from the given @Input "entity" and @Input "propertyKey"
 * and displays the input field accordingly.
 *
 * You can also define a method that generates error-messages and if the input should be hidden when its metadata says
 * that it should be omitted for creating or updating.
 * The last part being mostly relevant if you want to use this component inside an ngFor.
 */
@Component({
    selector: 'ngx-mat-entity-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss']
})
export class NgxMatEntityInputComponent<EntityType extends object> implements OnInit {
    /**
     * The entity on which the property exists. Used in conjunction with the "propertyKey"
     * to determine the property for which the input should be generated.
     */
    @Input()
    entity!: EntityType;

    /**
     * The name of the property to generate the input for. Used in conjunction with the "entity".
     */
    @Input()
    propertyKey!: keyof EntityType;

    /**
     * (optional) A custom function to generate the error-message for invalid inputs.
     */
    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    /**
     * Whether to hide a value if it is omitted for creation.
     * Is used internally for the object property.
     */
    @Input()
    hideOmitForCreate?: boolean;

    /**
     * Whether to hide a value if it is omitted for editing.
     * Is used internally for the object property.
     */
    @Input()
    hideOmitForEdit?: boolean;

    @ViewChild('addArrayItemDialog')
    addArrayItemDialog!: TemplateRef<unknown>;
    addArrayItemDialogRef!: MatDialogRef<unknown>;

    type!: DecoratorTypes;
    metadata!: PropertyDecoratorConfigInternal;

    metadataDefaultObject!: DefaultObjectDecoratorConfigInternal<EntityType>;
    objectProperty!: EntityType;
    objectPropertyRows!: EntityRow<EntityType>[];

    metadataEntityArray!: EntityArrayDecoratorConfigInternal<EntityType>;
    entityArrayValues!: EntityType[];
    arrayItem!: EntityType;
    private arrayItemPriorChanges!: EntityType;
    arrayItemInlineRows!: EntityRow<EntityType>[];
    dataSource!: MatTableDataSource<EntityType>;
    selection: SelectionModel<EntityType> = new SelectionModel<EntityType>(true, []);
    displayedColumns!: string[];

    dialogInputData!: AddArrayItemDialogData<EntityType>;
    dialogData!: AddArrayItemDialogDataInternal<EntityType>;
    arrayItemDialogRows!: EntityRow<EntityType>[];

    readonly DecoratorTypes = DecoratorTypes;

    EntityUtilities = EntityUtilities;
    DateUtilities = DateUtilities;

    constructor(
        private readonly dialog: MatDialog
    ) {}

    /**
     * This is needed for the inputs to work inside an ngFor.
     *
     * @param index - The index of the element in the ngFor.
     * @returns The index.
     */
    trackByFn(index: unknown): unknown {
        return index;
    }

    ngOnInit(): void {
        if (!this.entity) {
            throw new Error('Missing required Input data "entity"');
        }
        if (!this.propertyKey) {
            throw new Error('Missing required Input data "propertyKey"');
        }
        this.type = EntityUtilities.getPropertyType(this.entity, this.propertyKey);
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.propertyKey, this.type);

        this.metadataDefaultObject = this.metadata as DefaultObjectDecoratorConfigInternal<EntityType>;
        this.objectProperty = this.entity[this.propertyKey] as unknown as EntityType;
        if (this.type === DecoratorTypes.OBJECT) {
            this.objectPropertyRows = EntityUtilities.getEntityRows(this.objectProperty, this.hideOmitForCreate, this.hideOmitForEdit);
        }

        this.metadataEntityArray = this.metadata as EntityArrayDecoratorConfigInternal<EntityType>;
        if (this.type === DecoratorTypes.ARRAY) {
            if (!this.entity[this.propertyKey]) {
                (this.entity[this.propertyKey] as unknown as EntityType[]) = [];
            }
            this.entityArrayValues = this.entity[this.propertyKey] as unknown as EntityType[];
            if (!this.metadataEntityArray.createInline && !this.metadataEntityArray.createDialogData) {
                this.metadataEntityArray.createDialogData = {
                    title: 'Add'
                }
            }
            const givenDisplayColumns: string[] = this.metadataEntityArray.displayColumns.map((v) => v.displayName);
            if (givenDisplayColumns.find(s => s === 'select')) {
                throw new Error(
                    `The name "select" for a display column is reserved.
                    Please choose a different name.`
                );
            }
            this.displayedColumns = ['select'].concat(givenDisplayColumns);
            this.dataSource = new MatTableDataSource();
            this.dataSource.data = this.entityArrayValues;
            this.arrayItem = new this.metadataEntityArray.EntityClass();
            this.arrayItemInlineRows = EntityUtilities.getEntityRows(
                this.arrayItem,
                this.hideOmitForCreate === false ? false : true,
                this.hideOmitForEdit ? true : false
            );
            this.arrayItemPriorChanges = LodashUtilities.cloneDeep(this.arrayItem);

            this.dialogInputData = {
                entity: this.arrayItem,
                createDialogData: this.metadataEntityArray.createDialogData,
                getValidationErrorMessage: this.getValidationErrorMessage
            }
            this.dialogData = new AddArrayItemDialogDataBuilder(this.dialogInputData).getResult();
            this.arrayItemDialogRows = EntityUtilities.getEntityRows(this.dialogData.entity, true);
        }

        if (!this.getValidationErrorMessage) {
            this.getValidationErrorMessage = getValidationErrorMessage;
        }
    }

    /**
     * Tries to add an item to the entity array.
     * Does this either inline if the "createInline"-metadata is set to true
     * or in a separate dialog if it is set to false.
     */
    addEntity(): void {
        if (this.metadataEntityArray.createInline) {
            if (this.arrayItem) {
                if (
                    !this.metadataEntityArray.allowDuplicates
                    && this.entityArrayValues.find(v =>
                        EntityUtilities.isEqual(this.arrayItem, v, this.metadata, this.metadataEntityArray.itemType)
                    )
                ) {
                    this.dialog.open(NgxMatEntityConfirmDialogComponent, {
                        data: this.metadataEntityArray.duplicatesErrorDialog,
                        autoFocus: false,
                        restoreFocus: false
                    });
                    return;
                }
                this.entityArrayValues.push(LodashUtilities.cloneDeep(this.arrayItem));
                this.dataSource.data = this.entityArrayValues;
                EntityUtilities.resetChangesOnEntity(this.arrayItem, this.arrayItemPriorChanges);
            }
        }
        else {
            this.addArrayItemDialogRef = this.dialog.open(
                this.addArrayItemDialog,
                {
                    data: this.dialogData,
                    autoFocus: false,
                    restoreFocus: false
                }
            )
        }
    }

    /**
     * Adds the array item defined in the dialog.
     */
    addArrayItem(): void {
        this.addArrayItemDialogRef.close();
        this.entityArrayValues.push(LodashUtilities.cloneDeep(this.arrayItem));
        this.dataSource.data = this.entityArrayValues;
        EntityUtilities.resetChangesOnEntity(this.arrayItem, this.arrayItemPriorChanges);
    }

    /**
     * Cancels adding the array item defined in the dialog.
     */
    cancelAddArrayItem(): void {
        this.addArrayItemDialogRef.close();
        EntityUtilities.resetChangesOnEntity(this.arrayItem, this.arrayItemPriorChanges);
    }

    /**
     * Removes all selected entries from the entity array.
     *
     * @param selection - The selection containing the items to remove.
     * @param values - The values of the dataSource.
     * @param dataSource - The dataSource.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    remove(selection: SelectionModel<any>, values: any[], dataSource: MatTableDataSource<any>): void {
        selection.selected.forEach(s => {
            values.splice(values.indexOf(s), 1);
        });
        dataSource.data = values;
        selection.clear();
    }

    /**
     * Toggles all array-items in the table.
     *
     * @param selection - The selection to toggle.
     * @param dataSource - The dataSource of the selection.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    masterToggle(selection: SelectionModel<any>, dataSource: MatTableDataSource<any>): void {
        if (this.isAllSelected(selection, dataSource)) {
            selection.clear();
        }
        else {
            dataSource.data.forEach(row => selection.select(row));
        }
    }

    /**
     * Checks if all array-items in the table have been selected.
     * This is needed to display the "masterToggle"-checkbox correctly.
     *
     * @param selection - The selection to check.
     * @param dataSource - The dataSource of the selection.
     * @returns Whether or not all array-items in the table have been selected.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isAllSelected(selection: SelectionModel<any>, dataSource: MatTableDataSource<any>): boolean {
        const numSelected = selection.selected.length;
        const numRows = dataSource.data.length;
        return numSelected === numRows;
    }
}