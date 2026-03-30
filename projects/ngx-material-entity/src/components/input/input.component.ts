import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EnvironmentInjector, EventEmitter, Inject, Input, OnInit, Output, TemplateRef, ViewChild, inject, runInInjectionContext } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';

import { ArrayDateInputComponent } from './array/array-date-input/array-date-input.component';
import { ArrayDateRangeInputComponent } from './array/array-date-range-input/array-date-range-input.component';
import { ArrayDateTimeInputComponent } from './array/array-date-time-input/array-date-time-input.component';
import { ArrayStringAutocompleteChipsComponent } from './array/array-string-autocomplete-chips/array-string-autocomplete-chips.component';
import { ArrayStringChipsInputComponent } from './array/array-string-chips-input/array-string-chips-input.component';
import { BooleanCheckboxInputComponent } from './boolean/boolean-checkbox-input/boolean-checkbox-input.component';
import { BooleanDropdownInputComponent } from './boolean/boolean-dropdown-input/boolean-dropdown-input.component';
import { BooleanToggleInputComponent } from './boolean/boolean-toggle-input/boolean-toggle-input.component';
import { CustomInputComponent } from './custom/custom.component';
import { DateInputComponent } from './date/date-input/date-input.component';
import { DateRangeInputComponent } from './date/date-range-input/date-range-input.component';
import { DateTimeInputComponent } from './date/date-time-input/date-time-input.component';
import { FileDefaultInputComponent } from './file/file-default-input/file-default-input.component';
import { FileImageInputComponent } from './file/file-image-input/file-image-input.component';
import { NumberDropdownInputComponent } from './number/number-dropdown-input/number-dropdown-input.component';
import { NumberInputComponent } from './number/number-input/number-input.component';
import { NumberSliderInputComponent } from './number/number-slider-input/number-slider-input.component';
import { ReferencesManyInputComponent } from './relations/references-many-input/references-many-input.component';
import { StringAutocompleteInputComponent } from './string/string-autocomplete-input/string-autocomplete-input.component';
import { StringDropdownInputComponent } from './string/string-dropdown-input/string-dropdown-input.component';
import { StringInputComponent } from './string/string-input/string-input.component';
import { StringPasswordInputComponent } from './string/string-password-input/string-password-input.component';
import { StringTextboxInputComponent } from './string/string-textbox-input/string-textbox-input.component';
import { BaseEntityType } from '../../classes/entity.model';
import { EditArrayItemDialogDataInternal, EntityArrayDecoratorConfigInternal } from '../../decorators/array/array-decorator-internal.data';
import { DecoratorTypes } from '../../decorators/base/decorator-types.enum';
import { DropdownValue } from '../../decorators/base/dropdown-value.interface';
import { PropertyDecoratorConfigInternal } from '../../decorators/base/property-decorator-internal.data';
import { HasManyDecoratorConfigInternal } from '../../decorators/has-many/has-many-decorator-internal.data';
import { DefaultObjectDecoratorConfigInternal, DropdownObjectDecoratorConfigInternal } from '../../decorators/object/object-decorator-internal.data';
import { ReferencesOneDecoratorConfigInternal } from '../../decorators/references-one/references-one-decorator-internal.data';
import { DynamicStyleClassDirective } from '../../directives/dynamic-style-class.directive';
import { LodashUtilities } from '../../encapsulation/lodash.utilities';
import { ReflectUtilities } from '../../encapsulation/reflect.utilities';
import { UUIDUtilities } from '../../encapsulation/uuid.utilities';
import { defaultFalse } from '../../functions/default-false.function';
import { getChangesTooltipContent } from '../../functions/get-changes-tooltip-content.function';
import { NGX_GET_VALIDATION_ERROR_MESSAGE } from '../../functions/get-validation-error-message.function';
import { getValidationErrorsTooltipContent } from '../../functions/get-validation-errors-tooltip-content.function';
import { tableColumnValueToSortValue } from '../../functions/table-column-value-to-sort-value.function';
import { NGX_COMPLETE_GLOBAL_DEFAULT_VALUES, NgxGlobalDefaultValues } from '../../global-configuration-values';
import { EntityService } from '../../services/entity.service';
import { DateUtilities } from '../../utilities/date.utilities';
import { Difference, EntityTab, EntityUtilities } from '../../utilities/entity.utilities';
import { SelectionUtilities } from '../../utilities/selection.utilities';
import { ValidationError, ValidationUtilities } from '../../utilities/validation.utilities';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../confirm-dialog/confirm-dialog-data.builder';
import { NgxMatEntityConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { InternalCustomTableConfiguration } from '../custom-table/custom-table-configuration.model';
import { CreateDataBuilder, CreateDataInternal } from '../table/create-dialog/create-data.builder';
import { DisplayColumnValueComponent } from '../table/display-column-value/display-column-value.component';
import { EditActionInternal } from '../table/edit-dialog/edit-data.builder';
import { DisplayColumn, DynamicStyleClasses } from '../table/table-data';
import { BaseTableActionInternal, TableActionInternal } from '../table/table-data.builder';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { ArrayStringDropdownInputComponent } from './array/array-string-dropdown-input/array-string-dropdown-input.component';

/**
 * Generic type for contexts that can fill an inline template.
 */
type TemplateContext<T> = {
    /**
     * The actual value. The $implicit is needed so that we don't need to specify a key when writing "let-context" in the html template.
     */
    $implicit: T
};

/**
 * A form context that is used to fill an inline template.
 * This is used to go around the limitations of having everything in the same file due to circular dependencies.
 * The forms are used for object, hasMany, referencesMany and the dialogs.
 */
type FormContext<EntityType extends BaseEntityType<EntityType>> = {
    /**
     * The entity to build the form for.
     */
    entity: EntityType,
    /**
     * The tabs to display.
     */
    tabs: EntityTab<EntityType>[],
    /**
     * Whether or not edit values should be omitted.
     */
    hideOmitForEdit?: boolean,
    /**
     * Whether or not create values should be omitted.
     */
    hideOmitForCreate?: boolean,
    /**
     * What happens when the input changes.
     */
    inputChangeEvent: () => void | Promise<void>,
    /**
     * Whether or not the input is readonly.
     */
    isReadOnly?: (property: EntityType, key: keyof EntityType) => boolean,
    /**
     * Whether or not the input is valid empty.
     */
    validEmpty?: () => boolean
};

/**
 * A table context that is used to fill an inline template.
 * This is used to go around the limitations of having everything in the same file due to circular dependencies.
 * The table is used for entity array and hasMany.
 */
type TableContext<T> = InternalCustomTableConfiguration & {
    /**
     * The data source of the table.
     */
    dataSource: MatTableDataSource<T>,
    /**
     * Whether or not a error message should be shown when the table is empty.
     */
    shouldShowMissingError: boolean,
    /**
     * The selection of the table.
     */
    selection: SelectionModel<T>,
    /**
     * What happens when a cell is clicked.
     */
    clickCell: (value: T, displayColumn: DisplayColumn<T>) => void,
    /**
     * Whether or not the data for the table is currently being loaded.
     */
    isLoading: boolean,
    /**
     * All columns that should be displayed.
     */
    displayedColumns: string[]
};

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
    styleUrls: ['./input.component.scss', '../../scss/dialog-styles.scss', '../../scss/tailwind-classes.scss'],
    standalone: true,
    imports: [
        DisplayColumnValueComponent,
        CommonModule,
        MatTabsModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatDialogModule,
        MatBadgeModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatCheckboxModule,
        MatButtonModule,
        TooltipComponent,
        StringInputComponent,
        StringTextboxInputComponent,
        StringAutocompleteInputComponent,
        StringDropdownInputComponent,
        StringPasswordInputComponent,
        BooleanCheckboxInputComponent,
        BooleanToggleInputComponent,
        BooleanDropdownInputComponent,
        NumberInputComponent,
        NumberDropdownInputComponent,
        NumberSliderInputComponent,
        ArrayDateInputComponent,
        ArrayDateRangeInputComponent,
        ArrayDateTimeInputComponent,
        ArrayStringAutocompleteChipsComponent,
        ArrayStringChipsInputComponent,
        ArrayStringDropdownInputComponent,
        DateInputComponent,
        DateRangeInputComponent,
        DateTimeInputComponent,
        FileDefaultInputComponent,
        FileImageInputComponent,
        ReferencesManyInputComponent,
        CustomInputComponent,
        DynamicStyleClassDirective,
        MatSortModule,
        FaIconComponent
    ]
})
export class NgxMatEntityInputComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {

    // eslint-disable-next-line jsdoc/require-jsdoc
    faSearch: IconDefinition = faSearch;

    /**
     * The entity on which the property exists. Used in conjunction with the "propertyKey"
     * to determine the property for which the input should be generated.
     */
    @Input({ required: true })
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
    readonly inputChangeEvent: EventEmitter<void> = new EventEmitter<void>();

    /**
     * A setter for the has many and array sort.
     * Is needed because the sort is inside a switch case,
     * which means that at ngOnInit it can't be initialized.
     */
    @ViewChild(MatSort)
    private set sort(sort: MatSort) {
        if (this.hasManyTableContext != undefined) {
            this.hasManyTableContext.$implicit.dataSource.sort = this.hasManyTableContext.$implicit.dataSource.sort ?? sort;
        }
        if (this.entityArrayTableContext != undefined) {
            this.entityArrayTableContext.$implicit.dataSource.sort = this.entityArrayTableContext.$implicit.dataSource.sort ?? sort;
        }
    }

    /**
     * A setter for the has many and array paginator.
     * Is needed because the paginator is inside a switch case,
     * which means that at ngOnInit it can't be initialized.
     */
    @ViewChild(MatPaginator)
    private set paginator(paginator: MatPaginator) {
        if (this.hasManyTableContext != undefined) {
            this.hasManyTableContext.$implicit.dataSource.paginator = this.hasManyTableContext.$implicit.dataSource.paginator ?? paginator;
        }
        if (this.entityArrayTableContext != undefined) {
            // eslint-disable-next-line stylistic/max-len
            this.entityArrayTableContext.$implicit.dataSource.paginator = this.entityArrayTableContext.$implicit.dataSource.paginator ?? paginator;
        }
    }

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
     * The form context for an object property.
     */
    objectFormContext!: TemplateContext<FormContext<EntityType>>;

    /**
     * The metadata of an dropdown object property.
     */
    metadataDropdownObject!: DropdownObjectDecoratorConfigInternal<EntityType>;
    /**
     * All possible dropdown values for the object property.
     */
    private objectDropdownValues: DropdownValue<EntityType | undefined>[] = [];
    /**
     * A unique input name for the references one property.
     */
    objectDropdownName!: string;
    /**
     * All currently shown dropdown values for the object property.
     */
    filteredObjectDropdownValues: DropdownValue<EntityType | undefined>[] = [];
    // eslint-disable-next-line jsdoc/require-returns
    /**
     * The currently selected object as a drop down value.
     */
    get currentObjectDropdownValue(): DropdownValue<EntityType | undefined> | undefined {
        const value: DropdownValue<EntityType | undefined>[] = LodashUtilities.cloneDeep(this.objectDropdownValues ?? []);
        return value.find(v => LodashUtilities.isEqual(v.value, this.entity[this.propertyKey]));
    }
    // eslint-disable-next-line jsdoc/require-returns
    /**
     * Whether or not the current object dropdown value should be shown in the dropdown.
     */
    get shouldDisplayCurrentObjectDropdownValue(): boolean {
        return !!this.currentObjectDropdownValue
            && !this.filteredObjectDropdownValues.find(v => LodashUtilities.isEqual(v.value, this.currentObjectDropdownValue?.value));
    }
    /**
     * A compareWith method for the select.
     * Uses bind.
     */
    compareObjectsBound: (value1?: EntityType, value2?: EntityType) => boolean = this.compareObjects.bind(this);

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
     * The table context for the entity array input.
     */
    entityArrayTableContext!: TemplateContext<TableContext<EntityType>>;
    /**
     * The current array item to be added or updated.
     */
    arrayItem!: EntityType;
    /**
     * The array item before any changes have been made. Used to check if the form is dirty.
     */
    arrayItemPriorChanges!: EntityType;
    /**
     * The form context for adding an array item.
     */
    addArrayItemFormContext!: TemplateContext<FormContext<EntityType>>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    addArrayItemFormContext2!: TemplateContext<FormContext<EntityType>>;
    /**
     * The form context for editing an array item.
     */
    editArrayItemFormContext!: TemplateContext<FormContext<EntityType>>;
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
     * The tabs to display inside the edit array item dialog.
     */
    editArrayItemDialogData!: EditArrayItemDialogDataInternal<EntityType>;
    /**
     * All validation errors for the array item.
     */
    arrayItemValidationErrors: ValidationError[] = [];
    /**
     * All the changes that have been done to the array item.
     */
    arrayItemChanges: Difference<EntityType>[] = [];
    /**
     * What to display inside the array item tooltip.
     */
    arrayItemTooltipContent: string = '';

    /**
     * Metadata of a has many property.
     */
    metadataHasMany!: HasManyDecoratorConfigInternal<EntityType, EntityType>;
    /**
     * The table context for the has many input.
     */
    hasManyTableContext!: TemplateContext<TableContext<EntityType>>;
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
     * All the changes that have been done to the has many entity.
     */
    hasManyChanges: Difference<EntityType>[] = [];
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
     * The form context for creating an has many entity.
     */
    hasManyCreateFormContext!: TemplateContext<FormContext<EntityType>>;
    /**
     * The form context for editing an has many entity.
     */
    hasManyEditFormContext!: TemplateContext<FormContext<EntityType>>;
    private hasManyCreateBaseUrl!: string;

    /**
     * The metadata for a references one property.
     */
    metadataReferencesOne!: ReferencesOneDecoratorConfigInternal<EntityType>;
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
     * The form context for an references one property.
     */
    referencesOneFormContext!: TemplateContext<FormContext<EntityType>>;

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
            && !this.filteredReferencesOneDropdownValues.find(v => v.value === this.currentReferencesOneDropdownValue?.value);
    }

    constructor(
        private readonly dialog: MatDialog,
        private readonly injector: EnvironmentInjector,
        private readonly router: Router,
        @Inject(NGX_GET_VALIDATION_ERROR_MESSAGE)
        protected readonly defaultGetValidationErrorMessage: (model: NgModel) => string,
        @Inject(NGX_COMPLETE_GLOBAL_DEFAULT_VALUES)
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
     * Gets the value to display in the column.
     * Runs in environment context to enable injection.
     * @param entity - The entity to get the value from.
     * @param displayColumn - The display column to get the value from.
     * @returns The value of the display column.
     */
    getDisplayColumnValue(entity: EntityType, displayColumn: DisplayColumn<EntityType>): unknown {
        return runInInjectionContext(this.injector, () => displayColumn.value(entity));
    }

    /**
     * Emits a cellClicked event when the clicked column is enabled and clicking is allowed by the configuration.
     * @param value - The value of the row that was clicked.
     * @param dCol - The display column of the row that was clicked.
     * @param context - The context of the table where the cell was clicked.
     */
    clickCell<T>(value: T, dCol: DisplayColumn<T>, context: TableContext<T>): void {
        if (dCol.disableClick == true || !context.allowClick(value)) {
            return;
        }
        context.clickCell(value, dCol);
    }

    ngOnInit(): void {
        this.internalGetValidationErrorMessage = this.getValidationErrorMessage ?? this.defaultGetValidationErrorMessage;
        this.internalIsReadOnly = this.isReadOnly ?? false;

        const foundType: DecoratorTypes | undefined = EntityUtilities.getPropertyType(this.entity, this.propertyKey);
        if (foundType == undefined) {
            throw new Error(`No type was found for the key "${String(this.propertyKey)}"`);
        }
        this.type = foundType;
        if (this.validEmpty === true) {
            const currentMetadata: PropertyDecoratorConfigInternal<unknown> = ReflectUtilities.getMetadata(
                'metadata',
                this.entity,
                this.propertyKey
            ) as PropertyDecoratorConfigInternal<unknown>;
            ReflectUtilities.defineMetadata('metadata', { ...currentMetadata, required: defaultFalse }, this.entity, this.propertyKey);
        }

        const foundMetadata: PropertyDecoratorConfigInternal<unknown> | undefined = EntityUtilities.getPropertyMetadata(
            this.entity,
            this.propertyKey,
            this.type
        );
        if (!foundMetadata) {
            throw new Error(`No metadata was found for the key "${String(this.propertyKey)}"`);
        }
        this.metadata = foundMetadata;

        // eslint-disable-next-line typescript/switch-exhaustiveness-check
        switch (this.type) {
            case DecoratorTypes.OBJECT_DROPDOWN: {
                void this.initDropdownObjectInput();
                break;
            }
            case DecoratorTypes.OBJECT: {
                this.initObjectInput();
                break;
            }
            case DecoratorTypes.ARRAY: {
                this.initEntityArray();
                break;
            }
            case DecoratorTypes.HAS_MANY: {
                this.initHasMany();
                break;
            }
            case DecoratorTypes.REFERENCES_ONE: {
                void this.initReferencesOne();
                break;
            }
            default: {
                break;
            }
        }
    }

    private async initReferencesOne(): Promise<void> {
        this.metadataReferencesOne = this.metadata as ReferencesOneDecoratorConfigInternal<EntityType>;
        this.referencesOneName = this.propertyKey.toString() + 'input' + UUIDUtilities.create();

        await runInInjectionContext(
            this.injector,
            async () => {
                this.referencesOneAllReferencedEntities = await this.metadataReferencesOne.getReferencedEntities();
                this.referencesOneDropdownValues = this.metadataReferencesOne.getDropdownValues(
                    LodashUtilities.cloneDeep(this.referencesOneAllReferencedEntities)
                );
                this.filteredReferencesOneDropdownValues = LodashUtilities.cloneDeep(this.referencesOneDropdownValues);
                this.setReferencesOneObject();
            }
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
        if (givenDisplayColumns.find(s => s === 'select')) {
            throw new Error(
                `The name "select" for a display column is reserved.
                Please choose a different name.`
            );
        }
        this.hasManyTableContext = {
            $implicit: {
                ...new InternalCustomTableConfiguration(
                    this.globalConfig,
                    {
                        displayColumns: this.metadataHasMany.tableData.baseData.displayColumns as DisplayColumn<unknown>[],
                        withSelection: !this.internalIsReadOnly,
                        // eslint-disable-next-line stylistic/max-len
                        dynamicRowStyleClasses: this.metadataHasMany.tableData.baseData.dynamicRowStyleClasses as DynamicStyleClasses<unknown>,
                        allowClick: ((entity: EntityType) => {
                            return this.metadataHasMany.tableData.baseData.allowRead(entity)
                                || this.metadataHasMany.tableData.baseData.allowUpdate(entity);
                        }) as (value: unknown) => boolean,
                        displayLoadingSpinner: this.metadataHasMany.tableData.baseData.displayLoadingSpinner,
                        searchStringForRow: this.metadataHasMany.tableData.baseData.searchString as (value: unknown) => string
                    }
                ),
                displayedColumns: !this.metadataHasMany.tableData.baseData.tableActions.filter(tA => tA.type === 'multi-select').length
                    ? givenDisplayColumns
                    : ['select'].concat(givenDisplayColumns),
                dataSource: new MatTableDataSource(),
                isLoading: true,
                shouldShowMissingError: false,
                selection: new SelectionModel<EntityType>(true, []),
                clickCell: (entity, dCol) => this.editHasManyEntity(entity, dCol)
            }
        };

        this.hasManyTableContext.$implicit.dataSource.sortingDataAccessor = (entity: EntityType, header: string) => {
            return runInInjectionContext(this.injector, () => {
                const displayColumn: DisplayColumn<EntityType> = this.metadataHasMany.tableData.baseData.displayColumns
                    .find((dp) => dp.displayName === header) as DisplayColumn<EntityType>;
                return tableColumnValueToSortValue(displayColumn.value(entity));
            });
        };
        this.hasManyTableContext.$implicit.dataSource.filterPredicate = (entity: EntityType, filter: string) => {
            const searchStr: string = this.metadataHasMany.tableData.baseData.searchString(entity);
            const formattedSearchString: string = searchStr.toLowerCase();
            const formattedFilterString: string = filter.toLowerCase();
            return formattedSearchString.includes(formattedFilterString);
        };

        this.hasManyEntityService.entitiesSubject.subscribe((entities) => {
            this.hasManyTableContext.$implicit.dataSource.data = entities;
            this.hasManyTableContext.$implicit.selection.clear();
        });
        void runInInjectionContext(this.injector, async () => {
            const readBaseUrl: string = this.metadataHasMany.readBaseUrl(this.entity, this.metadataHasMany);
            await this.hasManyEntityService.read(readBaseUrl);
            this.hasManyTableContext.$implicit.isLoading = false;
        });
    }

    private initEntityArray(): void {
        this.metadata = new EntityArrayDecoratorConfigInternal(
            this.metadata as EntityArrayDecoratorConfigInternal<EntityType>,
            this.globalConfig
        );
        this.metadataEntityArray = this.metadata as EntityArrayDecoratorConfigInternal<EntityType>;
        if (this.entity[this.propertyKey] == undefined) {
            (this.entity[this.propertyKey] as EntityType[]) = [];
            ReflectUtilities.defineMetadata('metadata', this.metadata, this.entity, this.propertyKey);
        }
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
        this.entityArrayTableContext = {
            $implicit: {
                ...new InternalCustomTableConfiguration(
                    this.globalConfig,
                    {
                        displayColumns: this.metadataEntityArray.displayColumns as DisplayColumn<unknown>[],
                        withSelection: !this.internalIsReadOnly,
                        dynamicRowStyleClasses: this.metadataEntityArray.dynamicRowStyleClasses as DynamicStyleClasses<unknown>,
                        emptyErrorMessage: this.metadataEntityArray.missingErrorMessage
                    }
                ),
                displayedColumns: this.internalIsReadOnly ? givenDisplayColumns : ['select'].concat(givenDisplayColumns),
                dataSource: new MatTableDataSource(),
                isLoading: false,
                shouldShowMissingError: this.metadataEntityArray.required(this.entity),
                selection: new SelectionModel<EntityType>(true, []),
                clickCell: (entity, dCol) => void this.editArrayItem(entity, dCol)
            }
        };
        this.entityArrayTableContext.$implicit.dataSource.data = this.entity[this.propertyKey] as EntityType[];

        this.arrayItem = new this.metadataEntityArray.EntityClass();
        this.arrayItemPriorChanges = LodashUtilities.cloneDeep(this.arrayItem);
        EntityUtilities.setDefaultValues(this.arrayItem);

        this.addArrayItemFormContext = {
            $implicit: {
                entity: this.arrayItem,
                tabs: EntityUtilities.getEntityTabs(this.arrayItem, this.injector, true),
                inputChangeEvent: () => {
                    void this.checkIsArrayItemValid();
                    this.addArrayItemFormContext.$implicit.tabs = EntityUtilities.getEntityTabs(this.arrayItem, this.injector, true);
                },
                hideOmitForCreate: true
            }
        };
        this.addArrayItemFormContext2 = {
            $implicit: {
                entity: this.arrayItem,
                tabs: EntityUtilities.getEntityTabs(this.arrayItem, this.injector, true),
                inputChangeEvent: () => {},
                hideOmitForCreate: true,
                isReadOnly: () => true
            }
        };
        this.addArrayItemDialogData = new CreateDataBuilder(this.globalConfig, this.metadataEntityArray.createDialogData)
            .withDefault('createButtonLabel', this.globalConfig.addLabel)
            .withDefault('title', this.globalConfig.addArrayItemTitle)
            .getResult();

        this.editArrayItemDialogData = this.metadataEntityArray.editDialogData;
    }

    private async initDropdownObjectInput(): Promise<void> {
        this.metadataDropdownObject = this.metadata as DropdownObjectDecoratorConfigInternal<EntityType>;
        this.objectDropdownName = this.propertyKey.toString() + 'input' + UUIDUtilities.create();

        await runInInjectionContext(this.injector, async () => {
            this.objectDropdownValues = await this.metadataDropdownObject.dropdownValues(this.entity);
            this.filteredObjectDropdownValues = LodashUtilities.cloneDeep(this.objectDropdownValues);
        });
    }

    private initObjectInput(): void {
        this.metadataDefaultObject = this.metadata as DefaultObjectDecoratorConfigInternal<EntityType>;
        const objectProperty: EntityType = this.entity[this.propertyKey] as EntityType;
        const objectPropertyTabs: EntityTab<EntityType>[] = EntityUtilities.getEntityTabs(
            objectProperty,
            this.injector,
            this.hideOmitForCreate,
            this.hideOmitForEdit,
            this.metadataDefaultObject.omit
        );
        this.objectFormContext = {
            $implicit: {
                entity: objectProperty,
                tabs: objectPropertyTabs,
                hideOmitForCreate: this.hideOmitForCreate,
                hideOmitForEdit: this.hideOmitForEdit,
                isReadOnly: (property, key) => this.isPropertyReadOnly(property, key),
                inputChangeEvent: () => {
                    this.emitChange();
                    this.objectFormContext.$implicit.tabs = EntityUtilities.getEntityTabs(
                        objectProperty,
                        this.injector,
                        this.hideOmitForCreate,
                        this.hideOmitForEdit,
                        this.metadataDefaultObject.omit
                    );
                },
                validEmpty: () => !this.metadata.required(this.entity)
            }
        };
    }

    private startImportJson(): void {
        const input: HTMLInputElement = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = async () => {
            if (input.files) {
                await this.importJson(input.files[0]);
            }
        };
        input.click();
    }

    private async importJson(file: File): Promise<void> {
        // eslint-disable-next-line stylistic/max-len
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.globalConfig, this.hasManyImportAction.confirmDialogData)
            .withDefault('text', this.metadataHasMany.tableData.baseData.importActionData.confirmDialogData?.text)
            .withDefault('title', this.hasManyImportAction.displayName)
            .getResult();
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        const res: boolean | undefined = await firstValueFrom(dialogRef.afterClosed());
        if (res == true) {
            await this.hasManyEntityService.import(file);
        }
    }

    /**
     * Checks if two objects are equal. Is needed for the dropdown.
     * @param value1 - The first object to compare.
     * @param value2 - The second object to compare.
     * @returns Whether or not the objects are the same.
     */
    private compareObjects(value1?: EntityType, value2?: EntityType): boolean {
        const valueObject1: EntityType = new this.metadataDropdownObject.EntityClass(value1);
        const valueObject2: EntityType = new this.metadataDropdownObject.EntityClass(value2);
        return LodashUtilities.isEqual(valueObject1, valueObject2);
    }

    /**
     * Filters the dropdown values.
     * @param searchInput - The search input to filter for.
     */
    filterObjectDropdownValues(searchInput: string): void {
        const filter: string = searchInput.toLowerCase();
        this.filteredObjectDropdownValues = LodashUtilities.cloneDeep(this.objectDropdownValues).filter(option => {
            return option.displayName.toLowerCase().includes(filter) || JSON.stringify(option.value).toLowerCase()
                .includes(filter);
        });
    }

    /**
     * Sets the references one object using the input id.
     */
    setReferencesOneObject(): void {
        const foundEntity: EntityType | undefined = this.metadataReferencesOne.getEntityForId(
            this.entity[this.propertyKey] as string,
            this.referencesOneAllReferencedEntities
        );
        const referencesOneObject: EntityType = new this.metadataReferencesOne.EntityClass(foundEntity);
        const referencesOnePropertyTabs: EntityTab<EntityType>[] = EntityUtilities.getEntityTabs(
            referencesOneObject,
            this.injector,
            undefined,
            undefined,
            this.metadataReferencesOne.omit
        );

        if (this.metadataReferencesOne.dropdownOnly) {
            this.emitChange();
            return;
        }

        this.referencesOneFormContext = {
            $implicit: {
                entity: referencesOneObject,
                tabs: referencesOnePropertyTabs,
                hideOmitForCreate: this.hideOmitForCreate,
                hideOmitForEdit: this.hideOmitForEdit,
                isReadOnly: () => true,
                inputChangeEvent: () => {
                    this.emitChange();
                    this.referencesOneFormContext.$implicit.tabs = EntityUtilities.getEntityTabs(
                        referencesOneObject,
                        this.injector,
                        undefined,
                        undefined,
                        this.metadataReferencesOne.omit
                    );
                },
                validEmpty: () => !this.metadata.required(this.entity)
            }
        };
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
    async hasManyRunEditAction(action: EditActionInternal<EntityType>): Promise<void> {
        const requireConfirmDialog: boolean = runInInjectionContext(this.injector, () => {
            return action.requireConfirmDialog(this.hasManyEntityPriorChanges);
        });

        if (!requireConfirmDialog) {
            await this.confirmHasManyRunEditAction(action);
            return;
        }
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: action.confirmDialogData,
            autoFocus: false,
            restoreFocus: false
        });
        const res: boolean | undefined = await firstValueFrom(dialogRef.afterClosed());
        if (res == true) {
            await this.confirmHasManyRunEditAction(action);
        }
    }

    private async confirmHasManyRunEditAction(action: EditActionInternal<EntityType>): Promise<void> {
        await runInInjectionContext(this.injector, async () => {
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
        this.hasManyEditFormContext = {
            $implicit: {
                entity: this.hasManyEntity,
                hideOmitForEdit: true,
                isReadOnly: (property, key) => this.isPropertyReadOnly(property, key),
                inputChangeEvent: () => {
                    void this.checkHasManyEntity();
                    this.hasManyEditFormContext.$implicit.tabs = EntityUtilities.getEntityTabs(
                        this.hasManyEntity,
                        this.injector,
                        false,
                        true
                    );
                },
                tabs: EntityUtilities.getEntityTabs(this.hasManyEntity, this.injector, false, true)
            }
        };
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
            const data: EntityType[] = this.hasManyTableContext.$implicit.dataSource.data;
            // eslint-disable-next-line stylistic/max-len
            data[this.hasManyTableContext.$implicit.dataSource.data.findIndex((e) => e[this.hasManyEntityService.idKey] === entity[this.hasManyEntityService.idKey])] = entity;
            this.hasManyTableContext.$implicit.dataSource.data = data;
            this.hasManyTableContext.$implicit.selection.clear();
        }
    }

    /**
     * Tries to save the changes and close the dialog afterwards.
     * Also handles the confirmation if required.
     */
    async dialogEditHasMany(): Promise<void> {
        if (this.internalIsReadOnly || !this.isHasManyEntityValid || !this.isHasManyEntityDirty) {
            return;
        }
        if (!this.metadataHasMany.tableData.editData.editRequiresConfirmDialog) {
            await this.dialogConfirmEditHasMany();
            return;
        }

        // eslint-disable-next-line stylistic/max-len
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
        const res: boolean | undefined = await firstValueFrom(dialogRef.afterClosed());
        if (res == true) {
            await this.dialogConfirmEditHasMany();
        }
    }
    private async dialogConfirmEditHasMany(): Promise<void> {
        await this.hasManyEntityService.update(this.hasManyEntity, this.hasManyEntityPriorChanges);
        this.editHasManyDialogRef.close(1);
        this.emitChange();
    }

    /**
     * Tries to delete the entity and close the dialog afterwards.
     * Also handles the confirmation if required.
     */
    async deleteHasManyEntity(): Promise<void> {
        if (!this.metadataHasMany.tableData.editData.deleteRequiresConfirmDialog) {
            await this.confirmDeleteHasManyEntity();
            return;
        }

        // eslint-disable-next-line stylistic/max-len
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
        const res: boolean | undefined = await firstValueFrom(dialogRef.afterClosed());
        if (res == true) {
            await this.confirmDeleteHasManyEntity();
        }
    }

    private async confirmDeleteHasManyEntity(): Promise<void> {
        await this.hasManyEntityService.delete(this.hasManyEntityPriorChanges);
        this.editHasManyDialogRef.close(2);
        this.emitChange();
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
        this.hasManyCreateFormContext = {
            $implicit: {
                entity: this.hasManyEntity,
                hideOmitForCreate: true,
                inputChangeEvent: () => {
                    void this.checkIsHasManyEntityValid('create');
                    this.hasManyCreateFormContext.$implicit.tabs = EntityUtilities.getEntityTabs(this.hasManyEntity, this.injector, true);
                },
                tabs: EntityUtilities.getEntityTabs(this.hasManyEntity, this.injector, true)
            }
        };
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
    async dialogCreateHasMany(): Promise<void> {
        if (!this.isHasManyEntityValid) {
            return;
        }
        if (!this.metadataHasMany.tableData.createData.createRequiresConfirmDialog) {
            await this.dialogConfirmCreateHasMany();
            return;
        }

        // eslint-disable-next-line stylistic/max-len
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
        const res: boolean | undefined = await firstValueFrom(dialogRef.afterClosed());
        if (res == true) {
            await this.dialogConfirmCreateHasMany();
        }
    }
    private async dialogConfirmCreateHasMany(): Promise<void> {
        await this.hasManyEntityService.create(this.hasManyEntity, this.hasManyCreateBaseUrl);
        this.createHasManyDialogRef.close();
        this.emitChange();
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
    async runHasManyTableAction(action: TableActionInternal<EntityType>): Promise<void> {
        const requireConfirmDialog: boolean = runInInjectionContext(
            this.injector,
            () => action.requireConfirmDialog(this.hasManyTableContext.$implicit.selection.selected)
        );
        if (!requireConfirmDialog) {
            await this.confirmRunHasManyTableAction(action);
            return;
        }

        const defaultText: string[] = action.type === 'multi-select'
            ? this.globalConfig.confirmMultiSelectActionText(this.hasManyTableContext.$implicit.selection.selected)
            : this.globalConfig.confirmBaseActionText;
        const dialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.globalConfig, action.confirmDialogData)
            .withDefault('text', defaultText)
            .withDefault('title', action.displayName)
            .getResult();
        const dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent, boolean> = this.dialog.open(NgxMatEntityConfirmDialogComponent, {
            data: dialogData,
            autoFocus: false,
            restoreFocus: false
        });
        const res: boolean | undefined = await firstValueFrom(dialogRef.afterClosed());
        if (res == true) {
            await this.confirmRunHasManyTableAction(action);
        }
    }

    private async confirmRunHasManyTableAction(action: TableActionInternal<EntityType>): Promise<void> {
        await runInInjectionContext(this.injector, async () => {
            await action.action(this.hasManyTableContext.$implicit.selection.selected);
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
            return !action.enabled(this.hasManyTableContext.$implicit.selection.selected);
        });
    }

    /**
     * Applies the search input to filter the table entries.
     * @param event - The keyup-event which contains the search-string of the user.
     */
    applyHasManyFilter(event: Event): void {
        const filterValue: string = (event.target as HTMLInputElement).value;
        this.hasManyTableContext.$implicit.dataSource.filter = filterValue.trim().toLowerCase();
    }

    /**
     * Checks if the entity is valid for updating and if it is dirty.
     */
    async checkHasManyEntity(): Promise<void> {
        await this.checkIsHasManyEntityValid('update');
        this.hasManyChanges = await EntityUtilities.getDifferencesBetweenEntities(
            this.hasManyEntity,
            this.hasManyEntityPriorChanges,
            this.http,
            this.injector
        );
        if (!this.hasManyValidationErrors.length && this.hasManyChanges.length) {
            this.hasManyTooltipContent = runInInjectionContext(
                this.injector,
                () => getChangesTooltipContent(this.hasManyChanges)
            );
        }
        this.isHasManyEntityDirty = !!this.hasManyChanges.length;
    }

    /**
     * Checks if the entity is valid.
     * @param omit - Whether values omitted for create or update should be left out.
     */
    async checkIsHasManyEntityValid(omit: 'create' | 'update'): Promise<void> {
        this.hasManyValidationErrors = await ValidationUtilities.getEntityValidationErrors(this.hasManyEntity, this.injector, omit);
        if (this.hasManyValidationErrors.length) {
            this.hasManyTooltipContent = runInInjectionContext(
                this.injector,
                () => getValidationErrorsTooltipContent(this.hasManyValidationErrors)
            );
        }
        this.isHasManyEntityValid = this.hasManyValidationErrors.length === 0;
    }

    /**
     * Checks whether the array item is valid and if the array item is dirty.
     */
    async checkArrayItem(): Promise<void> {
        await this.checkIsArrayItemValid();
        await this.checkIsArrayItemDirty();
    }

    /**
     * Checks if the array item is dirty.
     */
    async checkIsArrayItemDirty(): Promise<void> {
        this.arrayItemChanges = await EntityUtilities.getDifferencesBetweenEntities(
            this.arrayItem,
            this.arrayItemPriorChanges,
            this.http,
            this.injector
        );
        if (!this.arrayItemValidationErrors.length && this.arrayItemChanges.length) {
            this.arrayItemTooltipContent = runInInjectionContext(
                this.injector,
                () => getChangesTooltipContent(this.arrayItemChanges)
            );
        }
        this.isArrayItemDirty = !!this.arrayItemChanges.length;
    }

    /**
     * Checks if the arrayItem is valid.
     */
    async checkIsArrayItemValid(): Promise<void> {
        this.arrayItemValidationErrors = await ValidationUtilities.getEntityValidationErrors(this.arrayItem, this.injector, 'create');
        if (this.arrayItemValidationErrors.length) {
            this.arrayItemTooltipContent = runInInjectionContext(
                this.injector,
                () => getValidationErrorsTooltipContent(this.arrayItemValidationErrors)
            );
        }
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
        if (!this.metadataEntityArray.createInline) {
            this.arrayItem = new this.metadataEntityArray.EntityClass();
            this.arrayItemPriorChanges = LodashUtilities.cloneDeep(this.arrayItem);
            EntityUtilities.setDefaultValues(this.arrayItem);

            this.addArrayItemFormContext = {
                $implicit: {
                    entity: this.arrayItem,
                    tabs: EntityUtilities.getEntityTabs(this.arrayItem, this.injector, true),
                    inputChangeEvent: () => {
                        void this.checkIsArrayItemValid();
                        this.addArrayItemFormContext.$implicit.tabs = EntityUtilities.getEntityTabs(this.arrayItem, this.injector, true);
                    },
                    hideOmitForCreate: true
                }
            };
            this.addArrayItemDialogRef = this.dialog.open(
                this.addArrayItemDialog,
                {
                    minWidth: '60%',
                    autoFocus: false,
                    restoreFocus: false
                }
            );
            return;
        }
        if (!this.metadataEntityArray.allowDuplicates) {
            for (const v of this.entityArrayTableContext.$implicit.dataSource.data) {
                if (await EntityUtilities.isEqual(this.arrayItem, v, this.metadata, this.metadataEntityArray.itemType, this.http)) {
                    this.dialog.open(NgxMatEntityConfirmDialogComponent, {
                        data: this.metadataEntityArray.duplicatesErrorDialog,
                        autoFocus: false,
                        restoreFocus: false
                    });
                    return;
                }
            }
        }

        (this.entity[this.propertyKey] as EntityType[]).push(LodashUtilities.cloneDeep(this.arrayItem));
        this.entityArrayTableContext.$implicit.dataSource.data = (this.entity[this.propertyKey] as EntityType[]);

        this.addArrayItemFormContext = undefined as unknown as TemplateContext<FormContext<EntityType>>;
        this.arrayItem = new this.metadataEntityArray.EntityClass();
        this.arrayItemPriorChanges = LodashUtilities.cloneDeep(this.arrayItem);
        EntityUtilities.setDefaultValues(this.arrayItem);

        setTimeout(
            // eslint-disable-next-line typescript/no-misused-promises
            async () => {
                this.addArrayItemFormContext = {
                    $implicit: {
                        entity: this.arrayItem,
                        tabs: EntityUtilities.getEntityTabs(this.arrayItem, this.injector, true),
                        inputChangeEvent: () => {
                            void this.checkIsArrayItemValid();
                            // eslint-disable-next-line stylistic/max-len
                            this.addArrayItemFormContext.$implicit.tabs = EntityUtilities.getEntityTabs(this.arrayItem, this.injector, true);
                        },
                        hideOmitForCreate: true
                    }
                };

                await this.checkIsArrayItemValid();

                this.emitChange();
            },
            150
        );
    }

    /**
     * Adds the array item defined in the dialog.
     */
    async addArrayItem(): Promise<void> {
        if (!this.isArrayItemValid) {
            return;
        }
        (this.entity[this.propertyKey] as EntityType[]).push(LodashUtilities.cloneDeep(this.arrayItem));
        this.entityArrayTableContext.$implicit.dataSource.data = (this.entity[this.propertyKey] as EntityType[]);

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
        this.indexOfEditedArrayItem = this.entityArrayTableContext.$implicit.dataSource.data.indexOf(entity);
        this.arrayItem = new this.metadataEntityArray.EntityClass(entity);
        this.arrayItemPriorChanges = LodashUtilities.cloneDeep(this.arrayItem);

        this.editArrayItemFormContext = {
            $implicit: {
                entity: this.arrayItem,
                tabs: EntityUtilities.getEntityTabs(this.arrayItem, this.injector, true),
                isReadOnly: (property, key) => this.isPropertyReadOnly(property, key),
                inputChangeEvent: () => {
                    void this.checkArrayItem();
                    this.editArrayItemFormContext.$implicit.tabs = EntityUtilities.getEntityTabs(this.arrayItem, this.injector, true);
                },
                hideOmitForEdit: true
            }
        };

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
        (this.entity[this.propertyKey] as EntityType[])[this.indexOfEditedArrayItem] = LodashUtilities.cloneDeep(this.arrayItem);
        this.entityArrayTableContext.$implicit.dataSource.data = (this.entity[this.propertyKey] as EntityType[]);

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
        SelectionUtilities.remove(
            this.entityArrayTableContext.$implicit.selection,
            this.entity[this.propertyKey] as EntityType[],
            this.entityArrayTableContext.$implicit.dataSource
        );
        this.emitChange();
    }
}