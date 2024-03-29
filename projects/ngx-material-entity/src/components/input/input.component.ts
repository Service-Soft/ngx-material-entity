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
    @Input( { required: true })
    entity!: EntityType;

    /**
     * The name of the property to generate the input for. Used in conjunction with the "entity".
     */
    @Input({ required: true })
    propertyKey!: keyof EntityType;

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
    private referencesOneDropdownValues!: DropdownValue<string>[];
    /**
     * The filtered dropdown values that get displayed in the references one dropdown input.
     */
    filteredReferencesOneDropdownValues!: DropdownValue<string>[];
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

    // eslint-disable-next-line jsdoc/require-returns
    /**
     * Gets the currently selected dropdown value for references one.
     * Is needed so that the dropdown value will still be displayed,
     * even when the filter method removes the value from the selectable dropdown values.
     */
    get currentReferencesOneDropdownValue(): DropdownValue<string> | undefined {
        return LodashUtilities.cloneDeep(this.referencesOneDropdownValues ?? [])
            .find(v => v.value === this.entity[this.propertyKey]);
    }

    // eslint-disable-next-line jsdoc/require-returns
    /**
     * Whether or not the currently selected references one value should be shown,
     * although it would have been filtered out by the search.
     */
    get shouldDisplayCurrentReferencesOneDropdownValue(): boolean {
        return !!this.currentReferencesOneDropdownValue
            && !(!!this.filteredReferencesOneDropdownValues.find(v => v.value === this.currentReferencesOneDropdownValue?.value));
    }

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
            const metadata: PropertyDecoratorConfigInternal<unknown> | undefined = EntityUtilities.getPropertyMetadata(property, key);
            if (!metadata) {
                throw new Error(`No metadata was found for the key "${String(key)}"`);
            }
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
        this.internalGetValidationErrorMessage = this.getValidationErrorMessage ?? this.defaultGetValidationErrorMessage;
        this.internalIsReadOnly = this.isReadOnly ?? false;

        const foundType: DecoratorTypes | undefined = EntityUtilities.getPropertyType(this.entity, this.propertyKey);
        if (foundType == null) {
            throw new Error(`No type was found for the key "${String(this.propertyKey)}"`);
        }
        this.type = foundType;
        if (this.validEmpty === true) {

            const currentMetadata: PropertyDecoratorConfigInternal<unknown> = ReflectUtilities.getMetadata('metadata', this.entity, this.propertyKey) as PropertyDecoratorConfigInternal<unknown>;

            ReflectUtilities.defineMetadata('metadata', { ...currentMetadata, required: defaultFalse }, this.entity, this.propertyKey);
        }

        const foundMetadata: PropertyDecoratorConfigInternal<unknown> | undefined = EntityUtilities.getPropertyMetadata(this.entity, this.propertyKey, this.type);
        if (!foundMetadata) {
            throw new Error(`No metadata was found for the key "${String(this.propertyKey)}"`);
        }
        this.metadata = foundMetadata;

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
        this.referencesOneName = this.propertyKey.toString() + 'input' + UUIDUtilities.create();

        void runInInjectionContext(
            this.injector,
            (async () => {
                this.referencesOneAllReferencedEntities = await this.metadataReferencesOne.getReferencedEntities();

                this.referencesOneDropdownValues = this.metadataReferencesOne.getDropdownValues(LodashUtilities.cloneDeep(this.referencesOneAllReferencedEntities));
                this.filteredReferencesOneDropdownValues = LodashUtilities.cloneDeep(this.referencesOneDropdownValues);
                this.setReferencesOneObject();
            })
        );
    }

    /**
     * Filters the references one dropdown values.
     * @param searchInput - The search input to filter for.
     */
    filterReferencesOneValues(searchInput: string): void {
        const filter: string = searchInput.toLowerCase();
        this.filteredReferencesOneDropdownValues = LodashUtilities.cloneDeep(this.referencesOneDropdownValues).filter(option => {
            return option.displayName.toLowerCase().includes(filter) || option.value.toLowerCase().includes(filter);
        });
    }

    private initHasMany(): void {
        this.metadata = new HasManyDecoratorConfigInternal(
            this.metadata as HasManyDecoratorConfigInternal<EntityType, EntityType>,
            this.globalConfig
        );
        ReflectUtilities.defineMetadata('metadata', this.metadata, this.entity, this.propertyKey);
        this.metadataHasMany = this.metadata as HasManyDecoratorConfigInternal<EntityType, EntityType>;
        this.hasManyImportAction = new BaseTableActionInternal({
            ...this.metadataHasMany.tableData.baseData.importActionData,
            action: () => this.startImportJson()
        }, this.globalConfig);

        runInInjectionContext(this.injector, () => {
            this.hasManyAllowCreate = this.metadataHasMany.tableData.baseData.allowCreate();
            this.hasManyEntityService = inject<EntityService<EntityType>>(this.metadataHasMany.tableData.baseData.EntityServiceClass);
            this.hasManyCreateBaseUrl = this.metadataHasMany.createBaseUrl(this.entity, this.metadataHasMany);
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
            const readBaseUrl: string = this.metadataHasMany.readBaseUrl(this.entity, this.metadataHasMany);
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
        ReflectUtilities.defineMetadata('metadata', this.metadata, this.entity, this.propertyKey);
        this.metadataEntityArray = this.metadata as EntityArrayDecoratorConfigInternal<EntityType>;
        if (this.entity[this.propertyKey] == null) {
            (this.entity[this.propertyKey] as EntityType[]) = [];
        }
        this.entityArrayValues = this.entity[this.propertyKey] as EntityType[];
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
        this.objectProperty = this.entity[this.propertyKey] as EntityType;
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

        const foundEntity: EntityType | undefined = this.metadataReferencesOne.getEntityForId(this.entity[this.propertyKey] as string, this.referencesOneAllReferencedEntities);
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
        void runInInjectionContext(this.injector, async () => {
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
                await this.createHasManyDefaultDialog(entity);
            }
        });
    }

    private createHasManyDefaultPage(): void {
        void this.router.navigateByUrl(this.hasManyEntityService.createBaseRoute);
    }

    private async createHasManyDefaultDialog(entity: EntityType): Promise<void> {
        this.hasManyEntity = entity;
        this.hasManyCreateTabs = EntityUtilities.getEntityTabs(this.hasManyEntity, this.injector, true);
        await this.checkIsHasManyEntityValid('create');
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
        await this.checkIsHasManyEntityValid('update');
        this.isHasManyEntityDirty = await EntityUtilities.isDirty(this.hasManyEntity, this.hasManyEntityPriorChanges, this.http);
    }

    /**
     * Checks if the entity is valid.
     * @param omit - Whether values omitted for create or update should be left out.
     */
    async checkIsHasManyEntityValid(omit: 'create' | 'update'): Promise<void> {
        this.hasManyValidationErrors = await ValidationUtilities.getEntityValidationErrors(this.hasManyEntity, this.injector, omit);

        this.hasManyTooltipContent = runInInjectionContext(this.injector, () => getValidationErrorsTooltipContent(this.hasManyValidationErrors));
        this.isHasManyEntityValid = this.hasManyValidationErrors.length === 0;
    }

    /**
     * Checks whether the array item is valid and if the array item is dirty.
     */
    async checkArrayItem(): Promise<void> {
        await this.checkIsArrayItemValid();
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
    async checkIsArrayItemValid(): Promise<void> {
        this.arrayItemValidationErrors = await ValidationUtilities.getEntityValidationErrors(this.arrayItem, this.injector, 'create');

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
        await this.checkIsArrayItemValid();
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
            await this.checkIsArrayItemValid();
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
    async addArrayItem(): Promise<void> {
        if (!this.isArrayItemValid) {
            return;
        }
        this.entityArrayValues.push(LodashUtilities.cloneDeep(this.arrayItem));
        this.entityArrayDataSource.data = this.entityArrayValues;

        await this.closeAddArrayItemDialog();
    }

    /**
     * Cancels adding the array item defined in the dialog.
     */
    async closeAddArrayItemDialog(): Promise<void> {
        this.addArrayItemDialogRef.close();
        EntityUtilities.resetChangesOnEntity(this.arrayItem, this.arrayItemPriorChanges);
        await this.checkIsArrayItemValid();
        this.emitChange();
    }

    /**
     * Edits an entity array item.
     * @param entity - The entity that has been clicked.
     * @param dCol - The display column that was clicked on.
     */
    async editArrayItem(entity: EntityType, dCol: DisplayColumn<EntityType>): Promise<void> {
        if (dCol.disableClick === true) {
            return;
        }
        this.indexOfEditedArrayItem = this.entityArrayValues.indexOf(entity);
        this.arrayItem = new this.metadataEntityArray.EntityClass(entity);
        this.arrayItemPriorChanges = LodashUtilities.cloneDeep(this.arrayItem);

        await this.checkArrayItem();

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

        void this.closeEditArrayItemDialog();
    }

    /**
     * Closes the edit array item dialog and resets changes.
     */
    async closeEditArrayItemDialog(): Promise<void> {
        this.editArrayItemDialogRef.close();
        this.arrayItem = new this.metadataEntityArray.EntityClass();
        this.arrayItemPriorChanges = LodashUtilities.cloneDeep(this.arrayItem);
        await this.checkArrayItem();
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