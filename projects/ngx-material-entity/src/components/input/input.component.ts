import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BaseEntityType } from '../../classes/entity.model';
import { EditArrayItemDialogDataInternal, EntityArrayDecoratorConfigInternal } from '../../decorators/array/array-decorator-internal.data';
import { DecoratorTypes } from '../../decorators/base/decorator-types.enum';
import { PropertyDecoratorConfigInternal } from '../../decorators/base/property-decorator-internal.data';
import { DefaultObjectDecoratorConfigInternal } from '../../decorators/object/object-decorator-internal.data';
import { LodashUtilities } from '../../encapsulation/lodash.utilities';
import { DateUtilities } from '../../utilities/date.utilities';
import { EntityTab, EntityUtilities } from '../../utilities/entity.utilities';
import { SelectionUtilities } from '../../utilities/selection.utilities';
import { NgxMatEntityConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NGX_GET_VALIDATION_ERROR_MESSAGE } from '../get-validation-error-message.function';
import { CreateDialogDataBuilder, CreateDialogDataInternal } from '../table/create-dialog/create-dialog-data.builder';

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
export class NgxMatEntityInputComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {
    /**
     * The entity on which the property exists. Used in conjunction with the "propertyKey"
     * to determine the property for which the input should be generated.
     */
    @Input()
    entity?: EntityType;
    internalEntity!: EntityType;

    /**
     * The name of the property to generate the input for. Used in conjunction with the "entity".
     */
    @Input()
    propertyKey?: keyof EntityType;
    internalPropertyKey!: keyof EntityType;

    /**
     * (optional) A custom function to generate the error-message for invalid inputs.
     */
    @Input()
    getValidationErrorMessage?: (model: NgModel) => string;
    internalGetValidationErrorMessage!: (model: NgModel) => string;

    /**
     * Whether to hide a value if it is omitted for creation.
     * Is used internally for the object property.
     *
     * @default false
     */
    @Input()
    hideOmitForCreate?: boolean;

    /**
     * Whether to hide a value if it is omitted for editing.
     * Is used internally for the object property.
     *
     * @default false
     */
    @Input()
    hideOmitForEdit?: boolean;

    /**
     * Whether or not the input should be readonly.
     * In that case it is disabled, but most of the default styling is overwritten.
     *
     * @default false
     */
    @Input()
    isReadOnly?: boolean;
    internalIsReadOnly!: boolean;

    @Output()
    inputChangeEvent: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('addArrayItemDialog')
    addArrayItemDialog!: TemplateRef<unknown>;
    addArrayItemDialogRef!: MatDialogRef<unknown>;

    @ViewChild('editArrayItemDialog')
    editArrayItemDialog!: TemplateRef<unknown>;
    editArrayItemDialogRef!: MatDialogRef<unknown>;

    type!: DecoratorTypes;
    metadata!: PropertyDecoratorConfigInternal;

    metadataDefaultObject!: DefaultObjectDecoratorConfigInternal<EntityType>;
    objectProperty!: EntityType;
    objectPropertyTabs!: EntityTab<EntityType>[];

    metadataEntityArray!: EntityArrayDecoratorConfigInternal<EntityType>;
    entityArrayValues!: EntityType[];
    arrayItem!: EntityType;
    arrayItemPriorChanges!: EntityType;
    arrayItemInlineTabs!: EntityTab<EntityType>[];
    dataSource!: MatTableDataSource<EntityType>;
    selection: SelectionModel<EntityType> = new SelectionModel<EntityType>(true, []);
    displayedColumns!: string[];
    isArrayItemValid: boolean = false;
    isArrayItemDirty: boolean = false;
    indexOfEditedArrayItem!: number;

    addArrayItemDialogData!: CreateDialogDataInternal;
    arrayItemDialogTabs!: EntityTab<EntityType>[];

    editArrayItemDialogData!: EditArrayItemDialogDataInternal<EntityType>;

    readonly DecoratorTypes: typeof DecoratorTypes = DecoratorTypes;

    EntityUtilities: typeof EntityUtilities = EntityUtilities;
    DateUtilities: typeof DateUtilities = DateUtilities;
    SelectionUtilities: typeof SelectionUtilities = SelectionUtilities;

    constructor(
        private readonly dialog: MatDialog,
        @Inject(NGX_GET_VALIDATION_ERROR_MESSAGE)
        protected readonly defaultGetValidationErrorMessage: (model: NgModel) => string
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
        this.internalEntity = this.entity;

        if (this.propertyKey == null) {
            throw new Error('Missing required Input data "propertyKey"');
        }
        this.internalPropertyKey = this.propertyKey;

        this.internalGetValidationErrorMessage = this.getValidationErrorMessage ?? this.defaultGetValidationErrorMessage;
        this.internalIsReadOnly = this.isReadOnly ?? false;

        this.type = EntityUtilities.getPropertyType(this.internalEntity, this.internalPropertyKey);
        this.metadata = EntityUtilities.getPropertyMetadata(this.internalEntity, this.internalPropertyKey, this.type);

        if (this.type === DecoratorTypes.OBJECT) {
            this.initObjectInput();
        }
        if (this.type === DecoratorTypes.ARRAY) {
            this.initEntityArray();
        }
    }

    private initEntityArray(): void {
        this.metadataEntityArray = this.metadata as EntityArrayDecoratorConfigInternal<EntityType>;
        if (this.internalEntity[this.internalPropertyKey] == null) {
            (this.internalEntity[this.internalPropertyKey] as EntityType[]) = [];
        }
        this.entityArrayValues = this.internalEntity[this.internalPropertyKey] as EntityType[];
        if (!this.metadataEntityArray.createInline && !this.metadataEntityArray.createDialogData) {
            this.metadataEntityArray.createDialogData = {
                title: 'Add'
            };
        }
        const givenDisplayColumns: string[] = this.metadataEntityArray.displayColumns.map((v) => v.displayName);
        if (givenDisplayColumns.find(s => s === 'select')) {
            throw new Error(
                `The name "select" for a display column is reserved.
                Please choose a different name.`
            );
        }
        this.displayedColumns = this.internalIsReadOnly ? givenDisplayColumns : ['select'].concat(givenDisplayColumns);
        this.dataSource = new MatTableDataSource();
        this.dataSource.data = this.entityArrayValues;
        this.arrayItem = new this.metadataEntityArray.EntityClass();
        this.arrayItemInlineTabs = EntityUtilities.getEntityTabs(this.arrayItem, true);

        this.addArrayItemDialogData = new CreateDialogDataBuilder(this.metadataEntityArray.createDialogData)
            .withDefault('createButtonLabel', 'Add')
            .withDefault('title', 'Add to array')
            .getResult();
        this.arrayItemDialogTabs = EntityUtilities.getEntityTabs(this.arrayItem, true);

        this.editArrayItemDialogData = this.metadataEntityArray.editDialogData;
    }

    private initObjectInput(): void {
        this.metadataDefaultObject = this.metadata as DefaultObjectDecoratorConfigInternal<EntityType>;
        this.objectProperty = this.internalEntity[this.internalPropertyKey] as EntityType;
        this.objectPropertyTabs = EntityUtilities.getEntityTabs(this.objectProperty, this.hideOmitForCreate, this.hideOmitForEdit);
    }

    /**
     * Checks whether the array item is valid and if the array item is dirty.
     */
    checkArrayItem(): void {
        this.checkIsArrayItemValid();
        void this.checkIsArrayItemDirty();
    }

    /**
     * Checks if the array item is dirty.
     */
    async checkIsArrayItemDirty(): Promise<void> {
        this.isArrayItemDirty = await EntityUtilities.isDirty(this.arrayItem, this.arrayItemPriorChanges);
    }

    /**
     * Checks if the arrayItem is valid.
     */
    checkIsArrayItemValid(): void {
        this.isArrayItemValid = EntityUtilities.isEntityValid(this.arrayItem, 'create');
    }

    /**
     * Emits that a the value has been changed.
     */
    emitChange(): void {
        this.inputChangeEvent.emit();
    }

    /**
     * Tries to add an item to the entity array.
     * Does this either inline if the "createInline"-metadata is set to true
     * or in a separate dialog if it is set to false.
     */
    async addEntity(): Promise<void> {
        if (this.metadataEntityArray.createInline) {
            if (!this.metadataEntityArray.allowDuplicates) {
                for (const v of this.entityArrayValues) {
                    if ((await EntityUtilities.isEqual(this.arrayItem, v, this.metadata, this.metadataEntityArray.itemType))) {
                        this.dialog.open(NgxMatEntityConfirmDialogComponent, {
                            data: this.metadataEntityArray.duplicatesErrorDialog,
                            autoFocus: false,
                            restoreFocus: false
                        });
                        return;
                    }
                }
            }
            this.entityArrayValues.push(LodashUtilities.cloneDeep(this.arrayItem));
            this.dataSource.data = this.entityArrayValues;
            this.arrayItem = new this.metadataEntityArray.EntityClass();
            this.checkIsArrayItemValid();
            this.emitChange();
        }
        else {
            this.addArrayItemDialogRef = this.dialog.open(
                this.addArrayItemDialog,
                {
                    minWidth: '60%',
                    autoFocus: false,
                    restoreFocus: false
                }
            );
        }
    }

    /**
     * Adds the array item defined in the dialog.
     */
    addArrayItem(): void {
        if (!this.isArrayItemValid) {
            return;
        }
        this.entityArrayValues.push(LodashUtilities.cloneDeep(this.arrayItem));
        this.dataSource.data = this.entityArrayValues;

        this.closeAddArrayItemDialog();
    }

    /**
     * Cancels adding the array item defined in the dialog.
     */
    closeAddArrayItemDialog(): void {
        this.addArrayItemDialogRef.close();
        this.arrayItem = new this.metadataEntityArray.EntityClass();
        this.checkIsArrayItemValid();
        this.emitChange();
    }

    /**
     * Edits an entity array item.
     *
     * @param entity - The entity that has been clicked.
     */
    editArrayItem(entity: EntityType): void {
        this.indexOfEditedArrayItem = this.entityArrayValues.indexOf(entity);
        this.arrayItem = new this.metadataEntityArray.EntityClass(entity);
        this.arrayItemPriorChanges = LodashUtilities.cloneDeep(this.arrayItem);

        this.checkArrayItem();

        this.editArrayItemDialogRef = this.dialog.open(
            this.editArrayItemDialog,
            {
                minWidth: '60%',
                autoFocus: false,
                restoreFocus: false
            }
        );
    }

    /**
     * Saves changes on the array item in the dialog.
     */
    saveArrayItem(): void {
        this.entityArrayValues[this.indexOfEditedArrayItem] = LodashUtilities.cloneDeep(this.arrayItem);
        this.dataSource.data = this.entityArrayValues;

        this.closeEditArrayItemDialog();
    }

    /**
     * Closes the edit array item dialog and resets changes.
     */
    closeEditArrayItemDialog(): void {
        this.editArrayItemDialogRef.close();
        this.arrayItem = new this.metadataEntityArray.EntityClass();
        this.arrayItemPriorChanges = LodashUtilities.cloneDeep(this.arrayItem);
        this.checkArrayItem();
        this.emitChange();
    }

    /**
     * Removes all selected entries from the entity array.
     */
    remove(): void {
        SelectionUtilities.remove(this.selection, this.entityArrayValues, this.dataSource);
        this.emitChange();
    }
}