import { EntityService } from '../../classes/entity-service.class';
import { Entity } from '../../classes/entity-model.class';
import { CreateDialogDataBuilder, CreateDialogDataInternal } from './create-dialog/create-dialog-data.builder';
import { EditDialogDataBuilder, EditDialogDataInternal } from './edit-dialog/edit-dialog-data.builder';
import { BaseData, DisplayColumn, MultiSelectAction, TableData } from './table-data';
import { HttpClient } from '@angular/common/http';

export class TableDataInternal<EntityType extends Entity> implements TableData<EntityType> {
    baseData: BaseDataInternal<EntityType>;
    createDialogData: CreateDialogDataInternal;
    editDialogData: EditDialogDataInternal<EntityType>;

    constructor(
        baseData: BaseDataInternal<EntityType>,
        createDialogData: CreateDialogDataInternal,
        editDialogData: EditDialogDataInternal<EntityType>
    ) {
        this.baseData = baseData;
        this.createDialogData = createDialogData;
        this.editDialogData = editDialogData;
    }
}

export class BaseDataBuilder<EntityType extends Entity> {
    baseData: BaseDataInternal<EntityType>;
    private readonly dataInput: BaseData<EntityType>;

    constructor(data: BaseData<EntityType>) {
        //this.validateInput(data);
        this.dataInput = data;
        this.baseData = new BaseDataInternal<EntityType>(
            data.title,
            data.displayColumns,
            data.EntityServiceClass,
            data.searchLabel ? data.searchLabel : 'Search',
            data.createButtonLabel ? data.createButtonLabel : 'Create',
            data.searchString ? data.searchString : defaultSearchFunction,
            data.allowCreate ? data.allowCreate : true,
            data.allowEdit ? data.allowEdit : () => true,
            data.allowDelete ? data.allowDelete : () => true,
            data.multiSelectActions ? data.multiSelectActions : [],
            data.multiSelectLabel ? data.multiSelectLabel : 'Actions',
            data.EntityClass,
            data.edit,
            data.create
        );
        return this;
    }
}

export class BaseDataInternal<EntityType extends Entity> implements BaseData<EntityType> {
    title: string;
    displayColumns: DisplayColumn<EntityType>[];
    EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>;
    searchLabel: string;
    createButtonLabel: string;
    searchString: (enity: EntityType) => string;
    allowCreate: boolean;
    allowEdit: (entity: EntityType) => boolean;
    allowDelete: (entity: EntityType) => boolean;
    multiSelectActions: MultiSelectAction<EntityType>[];
    multiSelectLabel: string

    EntityClass?: new (entity?: EntityType) => EntityType;
    edit?: (entity: EntityType) => unknown;
    create?: (entity: EntityType) => unknown;

    constructor(
        title: string,
        displayColumns: DisplayColumn<EntityType>[],
        EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>,
        searchLabel: string,
        createButtonLabel: string,
        searchString: (enity: EntityType) => string,
        allowCreate: boolean,
        allowEdit: (entity: EntityType) => boolean,
        allowDelete: (entity: EntityType) => boolean,
        multiSelectActions: MultiSelectAction<EntityType>[],
        multiSelectLabel: string,

        EntityClass?: new (entity?: EntityType) => EntityType,
        edit?: (entity: EntityType) => unknown,
        create?: (entity: EntityType) => unknown,
    ) {
        this.title = title;
        this.displayColumns = displayColumns;
        this.EntityServiceClass = EntityServiceClass;
        this.EntityClass = EntityClass;
        this.searchLabel = searchLabel;
        this.createButtonLabel = createButtonLabel;
        this.searchString = searchString;
        this.allowCreate = allowCreate;
        this.allowEdit = allowEdit;
        this.allowDelete = allowDelete;
        this.multiSelectActions = multiSelectActions;
        this.multiSelectLabel = multiSelectLabel;
        this.edit = edit;
        this.create = create;
    }
}

export class TableDataBuilder<EntityType extends Entity> {
    tableData: TableDataInternal<EntityType>;
    private readonly dataInput: TableData<EntityType>;

    constructor(data: TableData<EntityType>) {
        this.validateInput(data);
        this.dataInput = data;
        const createDialogData: CreateDialogDataInternal = new CreateDialogDataBuilder(data.createDialogData).createDialogData;
        const editDialogData: EditDialogDataInternal<EntityType> = new EditDialogDataBuilder(data.editDialogData).editDialogData;
        const baseData: BaseDataInternal<EntityType> = new BaseDataBuilder(data.baseData).baseData;
        this.tableData = new TableDataInternal<EntityType>(
            baseData,
            createDialogData,
            editDialogData
        );
        return this;
    }

    private validateInput(data: TableData<EntityType>): void {
        if (data.baseData.multiSelectActions?.length && data.baseData.displayColumns.find(dp => dp.displayName === 'select')) {
            throw new Error(
                `The name "select" for a display column is reserved for the multi-select action functionality.
                Please choose a different name.`
            );
        }
        if (
            (
                data.baseData.allowEdit && data.baseData.allowEdit !== (() => false)
                || data.baseData.allowDelete && data.baseData.allowDelete !== (() => false)
                || data.baseData.allowCreate
            )
            && !data.baseData.EntityClass
        ) {
            throw new Error(`
                Missing required Input data "EntityClass".
                You can only omit this value if you can neither create or update entities.`
            );
        }
        if (data.baseData.allowCreate !== false && !data.baseData.create && !data.createDialogData) {
            throw new Error(
                `Missing required Input data "createDialogData".
                You can only omit this value when creation is disallowed or done with a custom create method.`
            );
        }
        if (
            (
                data.baseData.allowEdit !== (() => false)
                || data.baseData.allowDelete !== (() => false)
            )
            && !data.baseData.edit
            && !data.editDialogData
        ) {
            throw new Error(
                `Missing required Input data "editDialogData".
                You can only omit this value when editing and deleting is disallowed or done with a custom edit method.`
            );
        }
    }
}

function defaultSearchFunction<EntityType extends Entity>(entity: EntityType): string {
    const searchString = Object.keys(entity as unknown as Record<string, unknown>)
        .reduce((currentTerm: string, key: string) => {
            return `${currentTerm}${(entity as unknown as Record<string, unknown>)[key]}◬`;
        }, '')
        .toLowerCase();
    return searchString;
}