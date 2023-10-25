import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, EnvironmentInjector, EventEmitter, Inject, Input, OnInit, Output, TemplateRef, ViewChild, inject, runInInjectionContext } from '@angular/core';
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
import { DropdownValue } from '../../decorators/base/dropdown-value.interface';
import { PropertyDecoratorConfigInternal } from '../../decorators/base/property-decorator-internal.data';
import { HasManyDecoratorConfigInternal } from '../../decorators/has-many/has-many-decorator-internal.data';
import { DefaultObjectDecoratorConfigInternal } from '../../decorators/object/object-decorator-internal.data';
import { ReferencesOneDecoratorConfigInternal } from '../../decorators/references-one/references-one-decorator-internal.data';
import { NGX_INTERNAL_GLOBAL_DEFAULT_VALUES } from '../../default-global-configuration-values';
import { LodashUtilities } from '../../encapsulation/lodash.utilities';
import { ReflectUtilities } from '../../encapsulation/reflect.utilities';
import { UUIDUtilities } from '../../encapsulation/uuid.utilities';
import { defaultFalse } from '../../functions/default-false.function';
import { NGX_GET_VALIDATION_ERROR_MESSAGE } from '../../functions/get-validation-error-message.function';
import { getValidationErrorsTooltipContent } from '../../functions/get-validation-errors-tooltip-content.function.ts';
import { NgxGlobalDefaultValues } from '../../global-configuration-values';
import { EntityService } from '../../services/entity.service';
import { DateUtilities } from '../../utilities/date.utilities';
import { EntityTab, EntityUtilities } from '../../utilities/entity.utilities';
import { SelectionUtilities } from '../../utilities/selection.utilities';
import { ValidationError, ValidationUtilities } from '../../utilities/validation.utilities';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../confirm-dialog/confirm-dialog-data.builder';
import { NgxMatEntityConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CreateDataBuilder, CreateDataInternal } from '../table/create-dialog/create-data.builder';
import { EditActionInternal } from '../table/edit-dialog/edit-data.builder';
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
// eslint-disable-next-line angular/prefer-standalone-component
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
    // eslint-disable-next-line jsdoc/require-jsdoc
    internalEntity!: EntityType;

    /**
     * The name of the property to generate the input for. Used in conjunction with the "entity".
     */
    @Input()
    propertyKey?: keyof EntityType;
    // eslint-disable-next-line jsdoc/require-jsdoc
    internalPropertyKey!: keyof EntityType;

    /**
     * (optional) A custom function to generate the error-message for invalid inputs.
     */
    @Input()
    getValidationErrorMessage?: (model: NgModel) => string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    internalGetValidationErrorMessage!: (model: NgModel) => string;

    /**
     * Whether to hide a value if it is omitted for creation.
     * Is used internally for the object property.
     * @default false
     */
    @Input()
    hideOmitForCreate?: boolean;

    /**
     * Whether to hide a value if it is omitted for editing.
     * Is used internally for the object property.
     * @default false
     */
    @Input()
    hideOmitForEdit?: boolean;

    /**
     * Whether or not an empty value should be valid.
     * Is used internally for the object property.
     * @default undefined
     */
    @Input()
    validEmpty?: boolean; // TODO

    /**
     * Whether or not the input should be readonly.
     * In that case it is disabled, but most of the default styling is overwritten.
     * @default false
     */
    @Input()
    isReadOnly?: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    internalIsReadOnly!: boolean;

    /**
     * Emits when the input value has been changed.
     */
    @Output()
    inputChangeEvent: EventEmitter<void> = new EventEmitter<void>();

    /**
     * The type of the decorator for this input.
     */
    type!: DecoratorTypes;
    /**
     * The property metadata received from the decorator.
     */
    metadata!: PropertyDecoratorConfigInternal<unknown>;

    /**
     * The metadata of an object property.
     */
    metadataDefaultObject!: DefaultObjectDecoratorConfigInternal<EntityType>;
    /**
     * The object property value.
     */
    objectProperty!: EntityType;
    /**
     * The tabs for the object property.
     */
    objectPropertyTabs!: EntityTab<EntityType>[];

    @ViewChild('addArrayItemDialog')
    private readonly addArrayItemDialog!: TemplateRef<unknown>;
    private addArrayItemDialogRef!: MatDialogRef<unknown>;
    @ViewChild('editArrayItemDialog')
    private readonly editArrayItemDialog!: TemplateRef<unknown>;
    private editArrayItemDialogRef!: MatDialogRef<unknown>;
    /**
     * The metadata of an entity array property.
     */
    metadataEntityArray!: EntityArrayDecoratorConfigInternal<EntityType>;
    /**
     * The entity array property value.
     */
    entityArrayValues!: EntityType[];
    /**
     * The current array item to be added or updated.
     */
    arrayItem!: EntityType;
    /**
     * The array item before any changes have been made. Used to check if the form is dirty.
     */
    arrayItemPriorChanges!: EntityType;
    /**
     * The inline tabs for adding an array item.
     */
    arrayItemInlineTabs!: EntityTab<EntityType>[];
    /**
     * The dataSource for the entity array.
     */
    entityArrayDataSource!: MatTableDataSource<EntityType>;
    /**
     * The selection for the entity array.
     */
    entityArraySelection: SelectionModel<EntityType> = new SelectionModel<EntityType>(true, []);
    /**
     * The columns to display in the entity array table.
     */
    entityArrayDisplayedColumns!: string[];
    /**
     * Whether or not the array item is valid.
     */
    isArrayItemValid: boolean = false;
    /**
     * Whether or not the array item is dirty.
     */
    isArrayItemDirty: boolean = false;
    /**
     * The index of the array item that is being edited.
     */
    private indexOfEditedArrayItem!: number;
    /**
     * Config for the dialog that adds a new array item.
     */
    addArrayItemDialogData!: CreateDataInternal;
    /**
     * The tabs to display inside the create array item dialog.
     */
    arrayItemDialogTabs!: EntityTab<EntityType>[];
    /**
     * The tabs to display inside the edit array item dialog.
     */
    editArrayItemDialogData!: EditArrayItemDialogDataInternal<EntityType>;
    /**
     * All validation errors for the array item.
     */
    arrayItemValidationErrors: ValidationError[] = [];
    /**
     * What to display inside the array item tooltip.
     */
    arrayItemTooltipContent: string = '';

    /**
     * Metadata of a has many property.
     */
    metadataHasMany!: HasManyDecoratorConfigInternal<EntityType, EntityType>;
    /**
     * Whether or not has many is currently loading.
     */
    hasManyIsLoading: boolean = true;
    /**
     * A setter for the has many paginator.
     * Is needed because the paginator is inside a switch case,
     * which means that at ngOnInit it can't be initialized.
     */
    @ViewChild(MatPaginator)
    set hasManyPaginator(paginator: MatPaginator) {
        if (!this.hasManyDataSource.paginator) {
            this.hasManyDataSource.paginator = paginator;
        }
    }
    /**
     * A setter for the has many sort.
     * Is needed because the sort is inside a switch case,
     * which means that at ngOnInit it can't be initialized.
     */
    @ViewChild(MatSort)
    private set hasManySort(sort: MatSort) {
        if (!this.hasManyDataSource.sort) {
            this.hasManyDataSource.sort = sort;
        }
    }
    @ViewChild('filter', { static: true })
    private readonly hasManyFilter!: string;
    /**
     * The columns of the has many table.
     */
    displayedHasManyColumns!: string[];
    /**
     * The data source of the has many table.
     */
    hasManyDataSource: MatTableDataSource<EntityType> = new MatTableDataSource();
    /**
     * The selection of the has many table.
     */
    hasManySelection: SelectionModel<EntityType> = new SelectionModel<EntityType>(true, []);
    /**
     * The has many import action.
     */
    hasManyImportAction!: BaseTableActionInternal;
    private hasManyEntityService!: EntityService<EntityType>;
    @ViewChild('createHasManyDialog')
    private readonly createHasManyDialog!: TemplateRef<unknown>;
    private createHasManyDialogRef!: MatDialogRef<unknown>;
    @ViewChild('editHasManyDialog')
    private readonly editHasManyDialog!: TemplateRef<unknown>;
    private editHasManyDialogRef!: MatDialogRef<unknown>;
    /**
     * A single has many entity.
     */
    hasManyEntity!: EntityType;
    /**
     * The single has many entity before any changes have been made. Is used to determine if the form is dirty.
     */
    hasManyEntityPriorChanges!: EntityType;
    /**
     * Whether or not the has many entity is valid.
     */
    isHasManyEntityValid: boolean = false;
    /**
     * All validation errors of the has many entity.
     */
    hasManyValidationErrors: ValidationError[] = [];
    /**
     * What to display inside the has many tooltip.
     */
    hasManyTooltipContent: string = '';
    /**
     * Whether or not the has many entity is dirty.
     */
    isHasManyEntityDirty: boolean = false;
    /**
     * Whether or not the current user is allowed to create a has many entity.
     */
    hasManyAllowCreate!: boolean;
    /**
     * The tabs to display when creating a new has many entity.
     */
    hasManyCreateTabs!: EntityTab<EntityType>[];
    /**
     * The tabs to display when updating a has many entity.
     */
    hasManyUpdateTabs!: EntityTab<EntityType>[];
    private hasManyCreateBaseUrl!: string;

    /**
     * The metadata for a references one property.
     */
    metadataReferencesOne!: ReferencesOneDecoratorConfigInternal<EntityType>;
    /**
     * The references one object.
     */
    referencesOneObject!: EntityType;
    /**
     * The tabs to display for the references one entity.
     */
    referencesOnePropertyTabs!: EntityTab<EntityType>[];
    /**
     * The values that can be possibly referenced.
     */
    private referencesOneAllReferencedEntities!: EntityType[];
    /**
     * The possible references one dropdown values.
     */
    referencesOneDropdownValues!: DropdownValue<string>[];
    /**
     * A unique input name for the references one property.
     */
    referencesOneName!: string;

    /**
     * The enum Values for all the different DecoratorTypes.
     */
    readonly DecoratorTypes: typeof DecoratorTypes = DecoratorTypes;
    /**
     * Contains HelperMethods around handling Entities and their property-metadata.
     */
    EntityUtilities: typeof EntityUtilities = EntityUtilities;
    /**
     * Contains Helper Functions for handling date properties.
     */
    DateUtilities: typeof DateUtilities = DateUtilities;
    /**
     * Provides functionality around material selections inside of tables.
     */
    SelectionUtilities: typeof SelectionUtilities = SelectionUtilities;

    constructor(
        private readonly dialog: MatDialog,
        private readonly injector: EnvironmentInjector,
        private readonly router: Router,
        @Inject(NGX_GET_VALIDATION_ERROR_MESSAGE)
        protected readonly defaultGetValidationErrorMessage: (model: NgModel) => string,
        @Inject(NGX_INTERNAL_GLOBAL_DEFAULT_VALUES)
        protected readonly globalConfig: NgxGlobalDefaultValues,
        private readonly http: HttpClient
    ) {}

    /**
     * Checks if the input with the given key on the given property is readonly.
     * @param property - The property on which to check the input.
     * @param key - The key for the input to check.
     * @returns Whether or not the input is readonly.
     */
    isPropertyReadOnly(property: EntityType, key: keyof EntityType): boolean {
        return runInInjectionContext(this.injector, () => {
            if (this.internalIsReadOnly || this.metadataDefaultObject?.isReadOnly(property)) {
                return true;
            }
            const metadata: PropertyDecoratorConfigInternal<unknown> = EntityUtilities.getPropertyMetadata(property, key);
            return metadata.isReadOnly(property);
        });
    }

    /**
     * This is needed for the inputs to work inside an ngFor.
     * @param index - The index of the element in the ngFor.
     * @returns The index.
     */
    trackByFn(index: unknown): unknown {
        return index;
    }

    /**
     * Gets the value to display in the column.
     * Runs in environment context to enable injection.
     * @param entity - The entity to get the value from.
     * @param displayColumn - The display column to get the value from.
     * @returns The value of the display column.
     */
    getDisplayColumnValue(entity: EntityType, displayColumn: DisplayColumn<EntityType>): unknown {
        return runInInjectionContext(this.injector, () => displayColumn.value(entity));
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
        if (this.validEmpty === true) {
            // eslint-disable-next-line max-len
            const currentMetadata: PropertyDecoratorConfigInternal<unknown> = ReflectUtilities.getMetadata('metadata', this.internalEntity, this.internalPropertyKey) as PropertyDecoratorConfigInternal<unknown>;
            // eslint-disable-next-line max-len
            ReflectUtilities.defineMetadata('metadata', { ...currentMetadata, required: defaultFalse }, this.internalEntity, this.internalPropertyKey);
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
            case DecoratorTypes.REFERENCES_ONE:
                this.initReferencesOne();
                break;
            default:
                break;
        }
    }

    private initReferencesOne(): void {
        this.metadataReferencesOne = this.metadata as ReferencesOneDecoratorConfigInternal<EntityType>;
        this.referencesOneName = this.internalPropertyKey.toString() + 'input' + UUIDUtilities.create();

        void runInInjectionContext(
            this.injector,
            (async () => {
                this.referencesOneAllReferencedEntities = await this.metadataReferencesOne.getReferencedEntities();
                // eslint-disable-next-line max-len
                this.referencesOneDropdownValues = this.metadataReferencesOne.getDropdownValues(LodashUtilities.cloneDeep(this.referencesOneAllReferencedEntities));
                this.setReferencesOneObject();
            })
        );
    }

    private initHasMany(): void {
        this.metadata = new HasManyDecoratorConfigInternal(
            this.metadata as HasManyDecoratorConfigInternal<EntityType, EntityType>,
            this.globalConfig
        );
        ReflectUtilities.defineMetadata('metadata', this.metadata, this.internalEntity, this.internalPropertyKey);
        this.metadataHasMany = this.metadata as HasManyDecoratorConfigInternal<EntityType, EntityType>;
        this.hasManyImportAction = new BaseTableActionInternal({
            ...this.metadataHasMany.tableData.baseData.importActionData,
            action: () => this.startImportJson()
        }, this.globalConfig);

        runInInjectionContext(this.injector, () => {
            this.hasManyAllowCreate = this.metadataHasMany.tableData.baseData.allowCreate();
            this.hasManyEntityService = inject<EntityService<EntityType>>(this.metadataHasMany.tableData.baseData.EntityServiceClass);
            this.hasManyCreateBaseUrl = this.metadataHasMany.createBaseUrl(this.internalEntity, this.metadataHasMany);
        });

        const givenDisplayColumns: string[] = this.metadataHasMany.tableData.baseData.displayColumns.map((v) => v.displayName);
        if (this.metadataHasMany.tableData.baseData.tableActions.filter(tA => tA.type === 'multi-select').length) {
            this.displayedHasManyColumns = ['select'].concat(givenDisplayColumns);
        }
        else {
            this.displayedHasManyColumns = givenDisplayColumns;
        }

        this.hasManyDataSource.sortingDataAccessor = (entity: EntityType, header: string) => {
            return runInInjectionContext(this.injector, () => {
                // eslint-disable-next-line max-len
                return this.metadataHasMany.tableData.baseData.displayColumns.find((dp) => dp.displayName === header)?.value(entity) as string;
            });
        };
        this.hasManyDataSource.filterPredicate = (entity: EntityType, filter: string) => {
            const searchStr: string = this.metadataHasMany.tableData.baseData.searchString(entity);
            const formattedSearchString: string = searchStr.toLowerCase();
            const formattedFilterString: string = filter.toLowerCase();
            return formattedSearchString.includes(formattedFilterString);
        };
        this.hasManyDataSource.filter = this.hasManyFilter;

        this.hasManyEntityService.entitiesSubject.subscribe((entities) => {
            this.hasManyDataSource.data = entities;
            this.hasManySelection.clear();
        });
        runInInjectionContext(this.injector, () => {
            const readBaseUrl: string = this.metadataHasMany.readBaseUrl(this.internalEntity, this.metadataHasMany);
            void this.hasManyEntityService.read(readBaseUrl).then(() => {
                this.hasManyIsLoading = false;
            });
        });
    }

    private initEntityArray(): void {
        this.metadata = new EntityArrayDecoratorConfigInternal(
            this.metadata as EntityArrayDecoratorConfigInternal<EntityType>,
            this.globalConfig
        );
        ReflectUtilities.defineMetadata('metadata', this.metadata, this.internalEntity, this.internalPropertyKey);
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
        this.arrayItemInlineTabs = EntityUtilities.getEntityTabs(this.arrayItem, this.injector, true);
        EntityUtilities.setDefaultValues(this.arrayItem);

        this.addArrayItemDialogData = new CreateDataBuilder(this.globalConfig, this.metadataEntityArray.createDialogData)
            .withDefault('createButtonLabel', this.globalConfig.addLabel)
            .withDefault('title', this.globalConfig.addArrayItemTitle)
            .getResult();
        this.arrayItemDialogTabs = EntityUtilities.getEntityTabs(this.arrayItem, this.injector, true);

        this.editArrayItemDialogData = this.metadataEntityArray.editDialogData;
    }

    private initObjectInput(): void {
        this.metadataDefaultObject = this.metadata as DefaultObjectDecoratorConfigInternal<EntityType>;
        this.objectProperty = this.internalEntity[this.internalPropertyKey] as EntityType;
        this.objectPropertyTabs = EntityUtilities.getEntityTabs(
            this.objectProperty,
            this.injector,
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
        // eslint-disable-next-line max-len
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.globalConfig, this.hasManyImportAction.confirmDialogData)
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
     * Sets the references one object using the input id.
     */
    setReferencesOneObject(): void {
        // eslint-disable-next-line max-len
        const foundEntity: EntityType | undefined = this.metadataReferencesOne.getEntityForId(this.internalEntity[this.internalPropertyKey] as string, this.referencesOneAllReferencedEntities);
        this.referencesOneObject = new this.metadataReferencesOne.EntityClass(foundEntity);
        this.referencesOnePropertyTabs = EntityUtilities.getEntityTabs(this.referencesOneObject, this.injector);
        this.emitChange();
    }

    /**
     * Edits an entity. This either calls the edit-Method provided by the user or uses a default edit-dialog.
     * @param entity - The entity that should be updated.
     * @param dCol - The display column that was clicked on.
     * @throws When no EntityClass was provided, as a new call is needed to initialize metadata.
     */
    editHasManyEntity(entity: EntityType, dCol: DisplayColumn<EntityType>): void {
        if ((dCol.disableClick === true) || (!this.hasManyAllowUpdate(entity) && !this.hasManyAllowRead(entity))) {
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

    /**
     * Whether updating the provided entity from the has many property is allowed.
     * @param entity - A single value of the has many property that the user wants to edit.
     * @returns True when the user can edit the provided entity and false otherwise.
     */
    hasManyAllowUpdate(entity: EntityType): boolean {
        return runInInjectionContext(this.injector, () => {
            return this.metadataHasMany.tableData.baseData.allowUpdate(entity);
        });
    }

    /**
     * Whether viewing the provided entity from the has many property is allowed.
     * @param entity - A single value of the has many property that the user wants to view.
     * @returns True when the user can view the provided entity and false otherwise.
     */
    hasManyAllowRead(entity: EntityType): boolean {
        return runInInjectionContext(this.injector, () => {
            return this.metadataHasMany.tableData.baseData.allowRead(entity);
        });
    }

    /**
     * Whether deleting the provided entity from the has many property is allowed.
     * @param entity - A single value of the has many property that the user wants to delete.
     * @returns True when the user can delete the provided entity and false otherwise.
     */
    hasManyAllowDelete(entity: EntityType): boolean {
        return runInInjectionContext(this.injector, () => {
            return this.metadataHasMany.tableData.baseData.allowDelete(entity);
        });
    }

    /**
     * Checks if an EditAction is disabled (e.g. Because the current entry doesn't fullfil the requirements).
     * @param action - The EditAction to check.
     * @returns Whether or not the Action can be used.
     */
    hasManyEditActionDisabled(action: EditActionInternal<EntityType>): boolean {
        return runInInjectionContext(this.injector, () => {
            return !action.enabled(this.hasManyEntityPriorChanges);
        });
    }

    /**
     * Runs the edit action on the entity.
     * @param action - The action to run.
     */
    hasManyRunEditAction(action: EditActionInternal<EntityType>): void {
        const requireConfirmDialog: boolean = runInInjectionContext(this.injector, () => {
            return action.requireConfirmDialog(this.hasManyEntityPriorChanges);
        });

        if (!requireConfirmDialog) {
            this.confirmHasManyRunEditAction(action);
            return;
        }
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: action.confirmDialogData,
            autoFocus: false,
            restoreFocus: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res == true) {
                this.confirmHasManyRunEditAction(action);
            }
        });
    }

    private confirmHasManyRunEditAction(action: EditActionInternal<EntityType>): void {
        void runInInjectionContext(this.injector, async () => {
            await action.action(this.hasManyEntity, this.hasManyEntityPriorChanges);
            await this.checkHasManyEntity();
        });
    }

    private editHasManyDefaultPage(entity: EntityType): void {
        void this.router.navigate(['', this.hasManyEntityService.editBaseRoute, entity[this.hasManyEntityService.idKey]]);
    }

    private async editHasManyDefaultDialog(entity: EntityType): Promise<void> {
        this.hasManyEntity = LodashUtilities.cloneDeep(entity);
        this.hasManyEntityPriorChanges = LodashUtilities.cloneDeep(this.hasManyEntity);
        this.hasManyUpdateTabs = EntityUtilities.getEntityTabs(this.hasManyEntity, this.injector, false, true);
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
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.globalConfig, this.metadataHasMany.tableData.editData.confirmEditDialogData)
            .withDefault('text', this.globalConfig.confirmSaveText)
            .withDefault('confirmButtonLabel', this.globalConfig.saveLabel)
            .withDefault('title', this.globalConfig.editLabel)
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
            .then(() => {
                this.editHasManyDialogRef.close(1);
                this.emitChange();
            });
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
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.globalConfig, this.metadataHasMany.tableData.editData.confirmDeleteDialogData)
            .withDefault('text', this.globalConfig.confirmDeleteText)
            .withDefault('type', 'delete')
            .withDefault('confirmButtonLabel', this.globalConfig.deleteLabel)
            .withDefault('title', this.globalConfig.deleteLabel)
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
        void this.hasManyEntityService.delete(this.hasManyEntityPriorChanges).then(() => {
            this.editHasManyDialogRef.close(2);
            this.emitChange();
        });
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
     * @throws When no EntityClass was provided, as a new call is needed to initialize metadata.
     */
    createHasManyEntity(): void {
        runInInjectionContext(this.injector, () => {
            if (this.metadataHasMany.tableData.baseData.allowCreate()) {
                if (!this.metadataHasMany.tableData.baseData.EntityClass) {
                    throw new Error('No "EntityClass" specified for this table');
                }
                if (this.metadataHasMany.tableData.baseData.create) {
                    this.metadataHasMany.tableData.baseData.create(new this.metadataHasMany.tableData.baseData.EntityClass());
                    return;
                }
                const entity: EntityType = new this.metadataHasMany.tableData.baseData.EntityClass();
                EntityUtilities.setDefaultValues(entity);
                if (this.metadataHasMany.tableData.baseData.defaultCreate == 'page') {
                    this.createHasManyDefaultPage();
                    return;
                }
                this.createHasManyDefaultDialog(entity);
            }
        });
    }

    private createHasManyDefaultPage(): void {
        void this.router.navigateByUrl(this.hasManyEntityService.createBaseRoute);
    }

    private createHasManyDefaultDialog(entity: EntityType): void {
        this.hasManyEntity = entity;
        this.hasManyCreateTabs = EntityUtilities.getEntityTabs(this.hasManyEntity, this.injector, true);
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
        if (!this.metadataHasMany.tableData.createData.createRequiresConfirmDialog) {
            this.dialogConfirmCreateHasMany();
            return;
        }
        // eslint-disable-next-line max-len
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.globalConfig, this.metadataHasMany.tableData.createData.confirmCreateDialogData)
            .withDefault('text', this.globalConfig.confirmCreateText)
            .withDefault('confirmButtonLabel', this.globalConfig.createLabel)
            .withDefault('title', this.globalConfig.createLabel)
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
        void this.hasManyEntityService.create(this.hasManyEntity, this.hasManyCreateBaseUrl).then(() => {
            this.createHasManyDialogRef.close();
            this.emitChange();
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
     * Also handles confirmation with an additional dial#og if configured.
     * @param action - The TableAction to run.
     */
    runHasManyTableAction(action: TableActionInternal<EntityType>): void {
        const requireConfirmDialog: boolean = runInInjectionContext(
            this.injector,
            () => action.requireConfirmDialog(this.hasManySelection.selected)
        );
        if (!requireConfirmDialog) {
            this.confirmRunHasManyTableAction(action);
            return;
        }
        // eslint-disable-next-line max-len
        const defaultText: string[] = action.type === 'multi-select' ? this.globalConfig.confirmMultiSelectActionText(this.hasManySelection.selected) : this.globalConfig.confirmBaseActionText;
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.globalConfig, action.confirmDialogData)
            .withDefault('text', defaultText)
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
        void runInInjectionContext(this.injector, async () => {
            await action.action(this.hasManySelection.selected);
            this.emitChange();
        });
    }

    /**
     * Checks if an TableAction is disabled (e.g. Because no entries have been selected).
     * @param action - The TableAction to check.
     * @returns Whether or not the Action can be used.
     */
    hasManyTableActionDisabled(action: TableActionInternal<EntityType>): boolean {
        return runInInjectionContext(this.injector, () => {
            return !action.enabled(this.hasManySelection.selected);
        });
    }

    /**
     * Applies the search input to filter the table entries.
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
        this.isHasManyEntityDirty = await EntityUtilities.isDirty(this.hasManyEntity, this.hasManyEntityPriorChanges, this.http);
    }

    /**
     * Checks if the entity is valid.
     * @param omit - Whether values omitted for create or update should be left out.
     */
    checkIsHasManyEntityValid(omit: 'create' | 'update'): void {
        this.hasManyValidationErrors = ValidationUtilities.getEntityValidationErrors(this.hasManyEntity, omit);
        // eslint-disable-next-line max-len
        this.hasManyTooltipContent = runInInjectionContext(this.injector, () => getValidationErrorsTooltipContent(this.hasManyValidationErrors));
        this.isHasManyEntityValid = this.hasManyValidationErrors.length === 0;
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
        this.isArrayItemDirty = await EntityUtilities.isDirty(this.arrayItem, this.arrayItemPriorChanges, this.http);
    }

    /**
     * Checks if the arrayItem is valid.
     */
    checkIsArrayItemValid(): void {
        this.arrayItemValidationErrors = ValidationUtilities.getEntityValidationErrors(this.arrayItem, 'create');
        // eslint-disable-next-line max-len
        this.arrayItemTooltipContent = runInInjectionContext(this.injector, () => getValidationErrorsTooltipContent(this.arrayItemValidationErrors));
        this.isArrayItemValid = this.arrayItemValidationErrors.length === 0;
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
                    if ((await EntityUtilities.isEqual(this.arrayItem, v, this.metadata, this.metadataEntityArray.itemType, this.http))) {
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
            EntityUtilities.setDefaultValues(this.arrayItem);
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
            this.checkIsArrayItemValid();
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
     * @param entity - The entity that has been clicked.
     * @param dCol - The display column that was clicked on.
     */
    editArrayItem(entity: EntityType, dCol: DisplayColumn<EntityType>): void {
        if (dCol.disableClick === true) {
            return;
        }
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