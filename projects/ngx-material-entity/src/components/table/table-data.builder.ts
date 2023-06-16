import { HttpClient } from '@angular/common/http';
import { BaseBuilder, defaultFalse, defaultTrue } from '../../classes/base.builder';
import { BaseEntityType, EntityClassNewable } from '../../classes/entity.model';
import { EntityService } from '../../services/entity.service';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../confirm-dialog/confirm-dialog-data.builder';
import { CreateDialogDataBuilder, CreateDialogDataInternal } from './create-dialog/create-dialog-data.builder';
import { EditDataInternal, EditDialogDataBuilder } from './edit-dialog/edit-data.builder';
import { BaseData, BaseTableAction, DisplayColumn, MultiSelectAction, TableData } from './table-data';

/**
 * The internal BaseTableAction. Sets default values.
 */
export class BaseTableActionInternal implements BaseTableAction {
    // eslint-disable-next-line jsdoc/require-jsdoc
    type: 'default' = 'default';
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayName: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    action: () => unknown;
    // eslint-disable-next-line jsdoc/require-jsdoc
    enabled: (() => boolean);
    // eslint-disable-next-line jsdoc/require-jsdoc
    requireConfirmDialog: (() => boolean);
    // eslint-disable-next-line jsdoc/require-jsdoc
    confirmDialogData: ConfirmDialogDataInternal;

    constructor(data: BaseTableAction) {
        this.displayName = data.displayName;
        this.action = data.action;
        this.enabled = data.enabled ?? defaultTrue;
        this.requireConfirmDialog = data.requireConfirmDialog ?? defaultFalse;
        this.confirmDialogData = new ConfirmDialogDataBuilder(data.confirmDialogData)
            .withDefault('text', ['Do you really want to run this action?'])
            .getResult();
    }
}

/**
 * The internal BaseTableAction. Sets default values.
 */
export class MultiSelectActionInternal<EntityType extends BaseEntityType<EntityType>> implements MultiSelectAction<EntityType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    type: 'multi-select' = 'multi-select';
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayName: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    action: (selectedEntities: EntityType[]) => unknown;
    // eslint-disable-next-line jsdoc/require-jsdoc
    enabled: ((selectedEntities: EntityType[]) => boolean);
    // eslint-disable-next-line jsdoc/require-jsdoc
    requireConfirmDialog: ((selectedEntities: EntityType[]) => boolean);
    // eslint-disable-next-line jsdoc/require-jsdoc
    confirmDialogData: ConfirmDialogDataInternal;

    constructor(data: MultiSelectAction<EntityType>) {
        this.displayName = data.displayName;
        this.action = data.action;
        this.enabled = data.enabled ?? ((entities: EntityType[]) => !!entities.length);
        this.requireConfirmDialog = data.requireConfirmDialog ?? defaultFalse;
        this.confirmDialogData = new ConfirmDialogDataBuilder(data.confirmDialogData)
            .withDefault('text', ['Do you really want to run this action?'])
            .getResult();
    }
}

/**
 * The Internal Table Action. Sets default values.
 */
export type TableActionInternal<EntityType extends BaseEntityType<EntityType>> =
    BaseTableActionInternal | MultiSelectActionInternal<EntityType>;

/**
 * The internal TableData. Requires all default values the user can leave out.
 */
export class TableDataInternal<EntityType extends BaseEntityType<EntityType>> implements TableData<EntityType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    baseData: BaseDataInternal<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    createDialogData: CreateDialogDataInternal;
    // eslint-disable-next-line jsdoc/require-jsdoc
    editData: EditDataInternal<EntityType>;

    constructor(
        baseData: BaseDataInternal<EntityType>,
        createDialogData: CreateDialogDataInternal,
        editDialogData: EditDataInternal<EntityType>
    ) {
        this.baseData = baseData;
        this.createDialogData = createDialogData;
        this.editData = editDialogData;
    }
}

/**
 * The Builder for the table BaseData. Sets default values.
 */
export class BaseDataBuilder<EntityType extends BaseEntityType<EntityType>>
    extends BaseBuilder<BaseDataInternal<EntityType>, BaseData<EntityType>> {

    constructor(data: BaseData<EntityType>) {
        super(data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data: BaseData<EntityType>): BaseDataInternal<EntityType> {
        return new BaseDataInternal<EntityType>(data);
    }
}

/**
 * The internal TableData. Requires all default values the user can leave out.
 */
export class BaseDataInternal<EntityType extends BaseEntityType<EntityType>> implements BaseData<EntityType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    title: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayColumns: DisplayColumn<EntityType>[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    searchLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    createButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    defaultEdit: 'dialog' | 'page';
    // eslint-disable-next-line jsdoc/require-jsdoc
    searchString: (entity: EntityType) => string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowCreate: () => boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowRead: (entity?: EntityType) => boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowUpdate: (entity?: EntityType) => boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowDelete: (entity?: EntityType) => boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    tableActions: TableActionInternal<EntityType>[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    tableActionsLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayLoadingSpinner: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowJsonImport: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    importActionData: Omit<BaseTableActionInternal, 'action'>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    EntityClass?: EntityClassNewable<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    edit?: (entity: EntityType) => unknown;
    // eslint-disable-next-line jsdoc/require-jsdoc
    create?: (entity: EntityType) => unknown;

    constructor(data: BaseData<EntityType>) {
        this.title = data.title;
        this.displayColumns = data.displayColumns;
        this.EntityServiceClass = data.EntityServiceClass;
        this.EntityClass = data.EntityClass;
        this.searchLabel = data.searchLabel ?? 'Search';
        this.createButtonLabel = data.createButtonLabel ?? 'Create';
        this.defaultEdit = data.defaultEdit ?? 'dialog';
        this.searchString = data.searchString ?? defaultSearchFunction;
        if (data.tableActions) {
            this.tableActions = data.tableActions.map(tA => {
                return tA.type === 'default' ? new BaseTableActionInternal(tA) : new MultiSelectActionInternal(tA);
            });
        }
        else {
            this.tableActions = [];
        }
        this.tableActionsLabel = data.tableActionsLabel ?? 'Actions';
        this.displayLoadingSpinner = data.displayLoadingSpinner ?? true;
        this.allowJsonImport = data.allowJsonImport ?? false;
        this.importActionData = this.buildImportActionData(data.importActionData);
        this.edit = data.edit;
        this.create = data.create;
        this.allowCreate = this.allowDataToFunction(data.allowCreate);
        this.allowRead = this.allowDataToFunction(data.allowRead);
        this.allowUpdate = this.allowDataToFunction(data.allowUpdate);
        this.allowDelete = this.allowDataToFunction(data.allowDelete);
    }

    private buildImportActionData(
        importActionData?: Omit<BaseTableAction, 'action' | 'requireConfirmDialog' | 'type'>
    ): Omit<BaseTableActionInternal, 'action'> {
        importActionData = importActionData ?? {
            displayName: 'Import (JSON)',
            confirmDialogData: new ConfirmDialogDataBuilder()
                .withDefault('text', ['Do you really want to import entities from the provided file?'])
                .getResult()
        };
        /* istanbul ignore next */
        const data: Omit<BaseTableActionInternal, 'action'> = {
            ...importActionData,
            enabled: importActionData.enabled ?? defaultTrue,
            requireConfirmDialog: defaultFalse,
            confirmDialogData: new ConfirmDialogDataBuilder(importActionData.confirmDialogData).getResult(),
            type: 'default'
        };
        return data;
    }

    private allowDataToFunction(value?: boolean | ((entity?: EntityType) => boolean)): ((entity?: EntityType) => boolean) {
        if (value == null) {
            return defaultTrue;
        }
        if (typeof value == 'boolean') {
            if (value) {
                return defaultTrue;
            }
            return defaultFalse;
        }
        return value;
    }
}

/**
 * The Builder for the complete TableData. Sets default values and validates user input.
 */
export class TableDataBuilder<EntityType extends BaseEntityType<EntityType>>
    extends BaseBuilder<TableDataInternal<EntityType>, TableData<EntityType>> {

    constructor(data: TableData<EntityType>) {
        super(data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data: TableData<EntityType>): TableDataInternal<EntityType> {
        const createDialogData: CreateDialogDataInternal = new CreateDialogDataBuilder(data.createDialogData).getResult();
        const editDialogData: EditDataInternal<EntityType> = new EditDialogDataBuilder(data.editData).getResult();
        const baseData: BaseDataInternal<EntityType> = new BaseDataBuilder(data.baseData).getResult();
        return new TableDataInternal<EntityType>(
            baseData,
            createDialogData,
            editDialogData
        );
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected override validateInput(data: TableData<EntityType>): void {
        if (data.baseData.tableActions?.length && data.baseData.displayColumns.find(dp => dp.displayName === 'select')) {
            throw new Error(
                `The name "select" for a display column is reserved for the multi-select action functionality.
                Please choose a different name.`
            );
        }
        if (
            !data.baseData.EntityClass
            && (
                data.baseData.allowCreate !== false
                || data.baseData.allowRead !== false
                || data.baseData.allowUpdate !== false
                || data.baseData.allowDelete !== false
            )
        ) {
            throw new Error(
                `Missing required Input data "EntityClass".
                You can only omit this value if you can neither create, read, update or delete entities.`
            );
        }
        if (data.editData && data.baseData.defaultEdit == 'page') {
            throw new Error(
                `The configured edit data can't be used, as the entity gets edited on its own page.
                You need to provide values for the "NGX_EDIT_DATA", "NGX_EDIT_DATA_ENTITY" and "NGX_EDIT_DATA_ENTITY_SERVICE" injection keys
                on the route where the edit page is used.`
            );
        }
    }
}

/**
 * The default search function taken from googles mat table.
 * This will be used if no custom search function is provided by the configuration.
 *
 * It generates a string from an entity which is then used to compare it to the search input.
 *
 * @param entity - An entity that is in the search.
 * @returns The generated string of the given entity used for comparison with the search input.
 */
export function defaultSearchFunction<EntityType extends BaseEntityType<EntityType>>(entity: EntityType): string {
    const searchString: string = Object.keys(entity)
        .reduce((currentTerm: string, key: string) => {
            return `${currentTerm}${(entity as Record<string, unknown>)[key]}◬`;
        }, '')
        .toLowerCase();
    return searchString;
}