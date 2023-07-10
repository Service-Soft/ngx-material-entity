import { SelectionModel } from '@angular/cdk/collections';
import { Component, EnvironmentInjector, EventEmitter, Inject, Input, OnInit, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseEntityType } from '../../classes/entity.model';
import { EditArrayItemDialogDataInternal, EntityArrayDecoratorConfigInternal } from '../../decorators/array/array-decorator-internal.data';
import { DecoratorTypes } from '../../decorators/base/decorator-types.enum';
import { PropertyDecoratorConfigInternal } from '../../decorators/base/property-decorator-internal.data';
import { HasManyDecoratorConfigInternal } from '../../decorators/has-many/has-many-decorator-internal.data';
import { DefaultObjectDecoratorConfigInternal } from '../../decorators/object/object-decorator-internal.data';
import { LodashUtilities } from '../../encapsulation/lodash.utilities';
import { ReflectUtilities } from '../../encapsulation/reflect.utilities';
import { EntityService } from '../../services/entity.service';
import { DateUtilities } from '../../utilities/date.utilities';
import { EntityTab, EntityUtilities } from '../../utilities/entity.utilities';
import { SelectionUtilities } from '../../utilities/selection.utilities';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../confirm-dialog/confirm-dialog-data.builder';
import { NgxMatEntityConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NGX_GET_VALIDATION_ERROR_MESSAGE } from '../get-validation-error-message.function';
import { CreateDialogDataBuilder, CreateDialogDataInternal } from '../table/create-dialog/create-dialog-data.builder';
import { DisplayColumn } from '../table/table-data';
import { BaseTableActionInternal, TableActionInternal } from '../table/table-data.builder';

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
     * Whether or not an empty value should be valid.
     * Is used internally for the object property.
     *
     * @default undefined
     */
    @Input()
    validEmpty?: boolean; // TODO

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
    entityArrayDataSource!: MatTableDataSource<EntityType>;
    entityArraySelection: SelectionModel<EntityType> = new SelectionModel<EntityType>(true, []);
    entityArrayDisplayedColumns!: string[];
    isArrayItemValid: boolean = false;
    isArrayItemDirty: boolean = false;
    indexOfEditedArrayItem!: number;
    addArrayItemDialogData!: CreateDialogDataInternal;
    arrayItemDialogTabs!: EntityTab<EntityType>[];
    editArrayItemDialogData!: EditArrayItemDialogDataInternal<EntityType>;

    metadataHasMany!: HasManyDecoratorConfigInternal<EntityType, EntityType>;
    hasManyIsLoading: boolean = true;
    @ViewChild(MatPaginator, { static: true })
    hasManyPaginator!: MatPaginator;
    @ViewChild(MatSort, { static: true })
    hasManySort!: MatSort;
    @ViewChild('filter', { static: true })
    hasManyFilter!: string;
    displayedHasManyColumns!: string[];
    hasManyDataSource: MatTableDataSource<EntityType> = new MatTableDataSource();
    hasManySelection: SelectionModel<EntityType> = new SelectionModel<EntityType>(true, []);
    hasManyImportAction!: BaseTableActionInternal;
    private hasManyEntityService!: EntityService<EntityType>;
    @ViewChild('createHasManyDialog')
    createHasManyDialog!: TemplateRef<unknown>;
    createHasManyDialogRef!: MatDialogRef<unknown>;
    @ViewChild('editHasManyDialog')
    editHasManyDialog!: TemplateRef<unknown>;
    editHasManyDialogRef!: MatDialogRef<unknown>;
    hasManyEntity!: EntityType;
    hasManyEntityPriorChanges!: EntityType;
    isHasManyEntityValid: boolean = false;
    isHasManyEntityDirty: boolean = false;
    hasManyCreateTabs!: EntityTab<EntityType>[];
    hasManyUpdateTabs!: EntityTab<EntityType>[];
    private createBaseUrl!: string;

    readonly DecoratorTypes: typeof DecoratorTypes = DecoratorTypes;

    EntityUtilities: typeof EntityUtilities = EntityUtilities;
    DateUtilities: typeof DateUtilities = DateUtilities;
    SelectionUtilities: typeof SelectionUtilities = SelectionUtilities;

    constructor(
        private readonly dialog: MatDialog,
        private readonly injector: EnvironmentInjector,
        private readonly router: Router,
        @Inject(NGX_GET_VALIDATION_ERROR_MESSAGE)
        protected readonly defaultGetValidationErrorMessage: (model: NgModel) => string
    ) {}

    /**
     * Checks if the input with the given key on the given property is readonly.
     *
     * @param property - The property on which to check the input.
     * @param key - The key for the input to check.
     * @returns Whether or not the input is read only.
     */
    isPropertyReadOnly(property: EntityType, key: keyof EntityType): boolean {
        return this.injector.runInContext(() => {
            const metadata: PropertyDecoratorConfigInternal = EntityUtilities.getPropertyMetadata(property, key);
            return this.internalIsReadOnly || metadata.isReadOnly(property);
        });
    }

    /**
     * This is needed for the inputs to work inside an ngFor.
     *
     * @param index - The index of the element in the ngFor.
     * @returns The index.
     */
    trackByFn(index: unknown): unknown {
        return index;
    }

    /**
     * Gets the value to display in the column.
     * Runs in environment context to enable injection.
     *
     * @param entity - The entity to get the value from.
     * @param displayColumn - The display column to get the value from.
     * @returns The value of the display column.
     */
    getDisplayColumnValue(entity: EntityType, displayColumn: DisplayColumn<EntityType>): unknown {
        return this.injector.runInContext(() => {
            return displayColumn.value(entity);
        });
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
        if (this.validEmpty != null) {
            // eslint-disable-next-line max-len
            const currentMetadata: object = ReflectUtilities.getMetadata('metadata', this.internalEntity, this.internalPropertyKey) as object;
            // eslint-disable-next-line max-len
            ReflectUtilities.defineMetadata('metadata', { ...currentMetadata, required: !this.validEmpty }, this.internalEntity, this.internalPropertyKey);
            ReflectUtilities.defineMetadata('validEmpty', true, this.internalEntity, this.internalPropertyKey);
        }
        this.metadata = EntityUtilities.getPropertyMetadata(this.internalEntity, this.internalPropertyKey, this.type);

        switch (this.type) {
            case DecoratorTypes.OBJECT:
                this.initObjectInput();
                break;
            case DecoratorTypes.ARRAY:
                this.initEntityArray();
                break;
            case DecoratorTypes.HAS_MANY:
                this.initHasMany();
                break;
            default:
                break;
        }
    }

    private initHasMany(): void {
        this.metadataHasMany = this.metadata as HasManyDecoratorConfigInternal<EntityType, EntityType>;
        this.hasManyImportAction = {
            ...this.metadataHasMany.tableData.baseData.importActionData,
            action: () => this.startImportJson()
        };

        this.injector.runInContext(() => {
            this.hasManyEntityService = inject<EntityService<EntityType>>(this.metadataHasMany.tableData.baseData.EntityServiceClass);
            this.createBaseUrl = this.metadataHasMany.createBaseUrl(this.internalEntity, this.metadataHasMany);
        });

        const givenDisplayColumns: string[] = this.metadataHasMany.tableData.baseData.displayColumns.map((v) => v.displayName);
        if (this.metadataHasMany.tableData.baseData.tableActions.filter(tA => tA.type === 'multi-select').length) {
            this.displayedHasManyColumns = ['select'].concat(givenDisplayColumns);
        }
        else {
            this.displayedHasManyColumns = givenDisplayColumns;
        }

        this.hasManyDataSource.sortingDataAccessor = (entity: EntityType, header: string) => {
            return this.injector.runInContext(() => {
                // eslint-disable-next-line max-len
                return this.metadataHasMany.tableData.baseData.displayColumns.find((dp) => dp.displayName === header)?.value(entity) as string;
            });
        };
        this.hasManyDataSource.sort = this.hasManySort;
        this.hasManyDataSource.filterPredicate = (entity: EntityType, filter: string) => {
            const searchStr: string = this.metadataHasMany.tableData.baseData.searchString(entity);
            const formattedSearchString: string = searchStr.toLowerCase();
            const formattedFilterString: string = filter.toLowerCase();
            return formattedSearchString.includes(formattedFilterString);
        };
        this.hasManyDataSource.filter = this.hasManyFilter;
        this.hasManyDataSource.paginator = this.hasManyPaginator;

        this.hasManyEntityService.entitiesSubject.subscribe((entities) => {
            this.hasManyDataSource.data = entities;
            this.hasManySelection.clear();
        });
        this.injector.runInContext(() => {
            const readBaseUrl: string = this.metadataHasMany.readBaseUrl(this.internalEntity, this.metadataHasMany);
            void this.hasManyEntityService.read(readBaseUrl).then(() => {
                this.hasManyIsLoading = false;
            });
        });
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
        this.entityArrayDisplayedColumns = this.internalIsReadOnly ? givenDisplayColumns : ['select'].concat(givenDisplayColumns);
        this.entityArrayDataSource = new MatTableDataSource();
        this.entityArrayDataSource.data = this.entityArrayValues;
        this.arrayItem = new this.metadataEntityArray.EntityClass();
        this.arrayItemPriorChanges = LodashUtilities.cloneDeep(this.arrayItem);
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
        this.objectPropertyTabs = EntityUtilities.getEntityTabs(
            this.objectProperty,
            this.hideOmitForCreate,
            this.hideOmitForEdit,
            this.metadataDefaultObject.omit
        );
    }

    private startImportJson(): void {
        const input: HTMLInputElement = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = async () => {
            if (input.files) {
                this.importJson(input.files[0]);
            }
        };
        input.click();
    }

    private importJson(file: File): void {
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.hasManyImportAction.confirmDialogData)
            .withDefault('text', this.metadataHasMany.tableData.baseData.importActionData.confirmDialogData?.text )
            .withDefault('title', this.hasManyImportAction.displayName)
            .getResult();
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res == true) {
                void this.hasManyEntityService.import(file);
            }
        });
    }

    /**
     * Edits an entity. This either calls the edit-Method provided by the user or uses a default edit-dialog.
     *
     * @param entity - The entity that should be updated.
     * @throws When no EntityClass was provided, as a new call is needed to initialize metadata.
     */
    editHasManyEntity(entity: EntityType): void {
        if (!(this.metadataHasMany.tableData.baseData.allowUpdate(entity) || this.metadataHasMany.tableData.baseData.allowRead(entity))) {
            return;
        }
        if (!this.metadataHasMany.tableData.baseData.EntityClass) {
            throw new Error('No "EntityClass" specified for this table');
        }
        if (this.metadataHasMany.tableData.baseData.edit) {
            this.metadataHasMany.tableData.baseData.edit(new this.metadataHasMany.tableData.baseData.EntityClass(entity));
            return;
        }
        if (this.metadataHasMany.tableData.baseData.defaultEdit == 'page') {
            this.editHasManyDefaultPage(new this.metadataHasMany.tableData.baseData.EntityClass(entity));
            return;
        }
        void this.editHasManyDefaultDialog(new this.metadataHasMany.tableData.baseData.EntityClass(entity));
    }

    private editHasManyDefaultPage(entity: EntityType): void {
        void this.router.navigate(['', this.hasManyEntityService.editBaseRoute, entity[this.hasManyEntityService.idKey]]);
    }

    private async editHasManyDefaultDialog(entity: EntityType): Promise<void> {
        this.hasManyEntity = LodashUtilities.cloneDeep(entity);
        this.hasManyEntityPriorChanges = LodashUtilities.cloneDeep(this.hasManyEntity);
        this.hasManyUpdateTabs = EntityUtilities.getEntityTabs(this.hasManyEntity, false, true);
        await this.checkHasManyEntity();
        this.editHasManyDialogRef = this.dialog.open(
            this.editHasManyDialog,
            {
                minWidth: '60%',
                autoFocus: false,
                restoreFocus: false
            }
        );
        const res: number = await firstValueFrom(this.editHasManyDialogRef.afterClosed()) as number;
        if (res === 0) {
            const data: EntityType[] = this.hasManyDataSource.data;
            // eslint-disable-next-line max-len
            data[this.hasManyDataSource.data.findIndex((e) => e[this.hasManyEntityService.idKey] === entity[this.hasManyEntityService.idKey])] = entity;
            this.hasManyDataSource.data = data;
            this.hasManySelection.clear();
        }
    }

    /**
     * Tries to save the changes and close the dialog afterwards.
     * Also handles the confirmation if required.
     */
    dialogEditHasMany(): void {
        if (this.internalIsReadOnly || !this.isHasManyEntityValid || !this.isHasManyEntityDirty) {
            return;
        }
        if (!this.metadataHasMany.tableData.editData.editRequiresConfirmDialog) {
            this.dialogConfirmEditHasMany();
            return;
        }
        // eslint-disable-next-line max-len
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.metadataHasMany.tableData.editData.confirmEditDialogData)
            .withDefault('text', ['Do you really want to save all changes?'])
            .withDefault('confirmButtonLabel', 'Save')
            .withDefault('title', 'Edit')
            .getResult();
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res == true) {
                this.dialogConfirmEditHasMany();
            }
        });
    }
    private dialogConfirmEditHasMany(): void {
        void this.hasManyEntityService.update(this.hasManyEntity, this.hasManyEntityPriorChanges)
            .then(() => this.editHasManyDialogRef.close(1));
    }

    /**
     * Tries to delete the entity and close the dialog afterwards.
     * Also handles the confirmation if required.
     */
    deleteHasManyEntity(): void {
        if (!this.metadataHasMany.tableData.editData.deleteRequiresConfirmDialog) {
            this.confirmDeleteHasManyEntity();
            return;
        }
        // eslint-disable-next-line max-len
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.metadataHasMany.tableData.editData.confirmDeleteDialogData)
            .withDefault('text', ['Do you really want to delete this entity?'])
            .withDefault('type', 'delete')
            .withDefault('confirmButtonLabel', 'Delete')
            .withDefault('title', 'Delete')
            .getResult();
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res == true) {
                this.confirmDeleteHasManyEntity();
            }
        });
    }

    private confirmDeleteHasManyEntity(): void {
        void this.hasManyEntityService.delete(this.hasManyEntityPriorChanges).then(() => this.editHasManyDialogRef.close(2));
    }

    /**
     * Cancels the editing of the has many entity and closes the dialog.
     */
    dialogCancelEditHasMany(): void {
        EntityUtilities.resetChangesOnEntity(this.hasManyEntity, this.hasManyEntityPriorChanges);
        this.editHasManyDialogRef.close(0);
    }

    /**
     * Creates a new Entity. This either calls the create-Method provided by the user or uses a default create-dialog.
     *
     * @throws When no EntityClass was provided, as a new call is needed to initialize metadata.
     */
    createHasManyEntity(): void {
        if (this.metadataHasMany.tableData.baseData.allowCreate()) {
            if (!this.metadataHasMany.tableData.baseData.EntityClass) {
                throw new Error('No "EntityClass" specified for this table');
            }
            if (this.metadataHasMany.tableData.baseData.create) {
                this.metadataHasMany.tableData.baseData.create(new this.metadataHasMany.tableData.baseData.EntityClass());
            }
            else {
                this.createHasManyDefault(new this.metadataHasMany.tableData.baseData.EntityClass());
            }
        }
    }

    private createHasManyDefault(entity: EntityType): void {
        this.hasManyEntity = entity;
        this.hasManyCreateTabs = EntityUtilities.getEntityTabs(this.hasManyEntity, true);
        this.checkIsHasManyEntityValid('create');
        this.createHasManyDialogRef = this.dialog.open(
            this.createHasManyDialog,
            {
                minWidth: '60%',
                autoFocus: false,
                restoreFocus: false
            }
        );
    }

    /**
     * Creates the has many entity over the dialog.
     */
    dialogCreateHasMany(): void {
        if (!this.isHasManyEntityValid) {
            return;
        }
        if (!this.metadataHasMany.tableData.createDialogData.createRequiresConfirmDialog) {
            this.dialogConfirmCreateHasMany();
            return;
        }
        // eslint-disable-next-line max-len
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.metadataHasMany.tableData.createDialogData.confirmCreateDialogData)
            .withDefault('text', ['Do you really want to create this entity?'])
            .withDefault('confirmButtonLabel', 'Create')
            .withDefault('title', 'Create')
            .getResult();
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res == true) {
                this.dialogConfirmCreateHasMany();
            }
        });
    }
    private dialogConfirmCreateHasMany(): void {
        void this.hasManyEntityService.create(this.hasManyEntity, this.createBaseUrl).then(() => {
            this.createHasManyDialogRef.close();
        });
    }

    /**
     * Cancels the creating of the has many entity and closes the dialog.
     */
    dialogCancelCreateHasMany(): void {
        this.createHasManyDialogRef.close();
    }

    /**
     * Runs the TableAction for all selected entries.
     * Also handles confirmation with an additional dialog if configured.
     *
     * @param action - The TableAction to run.
     */
    runHasManyTableAction(action: TableActionInternal<EntityType>): void {
        const requireConfirmDialog: boolean = this.injector.runInContext(() => {
            return action.requireConfirmDialog(this.hasManySelection.selected);
        });
        if (!requireConfirmDialog) {
            this.confirmRunHasManyTableAction(action);
            return;
        }
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(action.confirmDialogData)
            .withDefault('text', [`Do you really want to run this action on ${this.hasManySelection.selected.length} entries?`])
            .withDefault('title', action.displayName)
            .getResult();
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res == true) {
                this.confirmRunHasManyTableAction(action);
            }
        });
    }

    private confirmRunHasManyTableAction(action: TableActionInternal<EntityType>): void {
        this.injector.runInContext(() => {
            action.action(this.hasManySelection.selected);
        });
    }

    /**
     * Checks if an TableAction is disabled (e.g. Because no entries have been selected).
     *
     * @param action - The TableAction to check.
     * @returns Whether or not the Action can be used.
     */
    hasManyTableActionDisabled(action: TableActionInternal<EntityType>): boolean {
        return this.injector.runInContext(() => {
            return !action.enabled(this.hasManySelection.selected);
        });
    }

    /**
     * Applies the search input to filter the table entries.
     *
     * @param event - The keyup-event which contains the search-string of the user.
     */
    applyHasManyFilter(event: Event): void {
        const filterValue: string = (event.target as HTMLInputElement).value;
        this.hasManyDataSource.filter = filterValue.trim().toLowerCase();
    }

    /**
     * Checks if the entity is valid for updating and if it is dirty.
     */
    async checkHasManyEntity(): Promise<void> {
        this.checkIsHasManyEntityValid('update');
        this.isHasManyEntityDirty = await EntityUtilities.isDirty(this.hasManyEntity, this.hasManyEntityPriorChanges);
    }

    /**
     * Checks if the entity is valid.
     *
     * @param omit - Whether values omitted for create or update should be left out.
     */
    checkIsHasManyEntityValid(omit: 'create' | 'update'): void {
        this.isHasManyEntityValid = EntityUtilities.isEntityValid(this.hasManyEntity, omit);
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
            this.entityArrayDataSource.data = this.entityArrayValues;
            EntityUtilities.resetChangesOnEntity(this.arrayItem, this.arrayItemPriorChanges);
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
        this.entityArrayDataSource.data = this.entityArrayValues;

        this.closeAddArrayItemDialog();
    }

    /**
     * Cancels adding the array item defined in the dialog.
     */
    closeAddArrayItemDialog(): void {
        this.addArrayItemDialogRef.close();
        EntityUtilities.resetChangesOnEntity(this.arrayItem, this.arrayItemPriorChanges);
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
        this.entityArrayDataSource.data = this.entityArrayValues;

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
    removeFromEntityArray(): void {
        SelectionUtilities.remove(this.entityArraySelection, this.entityArrayValues, this.entityArrayDataSource);
        this.emitChange();
    }
}