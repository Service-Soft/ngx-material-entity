import { EntityService } from '../../classes/entity.service';
import { CreateDialogDataBuilder, CreateDialogDataInternal } from './create-dialog/create-dialog-data.builder';
import { EditDialogDataBuilder, EditDialogDataInternal } from './edit-dialog/edit-dialog-data.builder';
import { BaseData, DisplayColumn, MultiSelectAction, TableData } from './table-data';
import { HttpClient } from '@angular/common/http';
import { BaseBuilder } from '../../classes/base.builder';
import { BaseEntityType, EntityClassNewable } from '../../classes/entity.model';

/**
 * The internal TableData. Requires all default values the user can leave out.
 */
export class TableDataInternal<EntityType extends BaseEntityType> implements TableData<EntityType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    baseData: BaseDataInternal<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    createDialogData: CreateDialogDataInternal;
    // eslint-disable-next-line jsdoc/require-jsdoc
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

/**
 * The Builder for the table BaseData. Sets default values.
 */
export class BaseDataBuilder<EntityType extends BaseEntityType> extends BaseBuilder<BaseDataInternal<EntityType>, BaseData<EntityType>> {

    constructor(data: BaseData<EntityType>) {
        super(data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data: BaseData<EntityType>): BaseDataInternal<EntityType> {
        return new BaseDataInternal<EntityType>(
            data.title,
            data.displayColumns,
            data.EntityServiceClass,
            data.searchLabel ?? 'Search',
            data.createButtonLabel ?? 'Create',
            data.searchString ?? defaultSearchFunction,
            data.allowCreate ?? true,
            data.allowEdit ?? (() => true),
            data.allowDelete ?? (() => true),
            data.multiSelectActions ?? [],
            data.multiSelectLabel ?? 'Actions',
            data.EntityClass,
            data.edit,
            data.create
        );
    }
}

/**
 * The internal TableData. Requires all default values the user can leave out.
 */
export class BaseDataInternal<EntityType extends BaseEntityType> implements BaseData<EntityType> {
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
    searchString: (entity: EntityType) => string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowCreate: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowEdit: (entity: EntityType) => boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    allowDelete: (entity: EntityType) => boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    multiSelectActions: MultiSelectAction<EntityType>[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    multiSelectLabel: string;

    // eslint-disable-next-line jsdoc/require-jsdoc
    EntityClass?: EntityClassNewable<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    edit?: (entity: EntityType) => unknown;
    // eslint-disable-next-line jsdoc/require-jsdoc
    create?: (entity: EntityType) => unknown;

    constructor(
        title: string,
        displayColumns: DisplayColumn<EntityType>[],
        EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>,
        searchLabel: string,
        createButtonLabel: string,
        searchString: (entity: EntityType) => string,
        allowCreate: boolean,
        allowEdit: (entity: EntityType) => boolean,
        allowDelete: (entity: EntityType) => boolean,
        multiSelectActions: MultiSelectAction<EntityType>[],
        multiSelectLabel: string,

        EntityClass?: EntityClassNewable<EntityType>,
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

/**
 * The Builder for the complete TableData. Sets default values and validates user input.
 */
export class TableDataBuilder<EntityType extends BaseEntityType> extends BaseBuilder<TableDataInternal<EntityType>, TableData<EntityType>> {

    constructor(data: TableData<EntityType>) {
        super(data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data: TableData<EntityType>): TableDataInternal<EntityType> {
        const createDialogData: CreateDialogDataInternal = new CreateDialogDataBuilder(data.createDialogData).getResult();
        const editDialogData: EditDialogDataInternal<EntityType> = new EditDialogDataBuilder(data.editDialogData).getResult();
        const baseData: BaseDataInternal<EntityType> = new BaseDataBuilder(data.baseData).getResult();
        return new TableDataInternal<EntityType>(
            baseData,
            createDialogData,
            editDialogData
        );
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected override validateInput(data: TableData<EntityType>): void {
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
                || data.baseData.allowCreate === true
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

/**
 * The default search function taken from googles mat table.
 * This will be used if no custom search function is provided by the configuration.
 *
 * It generates a string from an entity which is then used to compare it to the search input.
 *
 * @param entity - An entity that is in the search.
 * @returns The generated string of the given entity used for comparison with the search input.
 */
function defaultSearchFunction<EntityType extends BaseEntityType>(entity: EntityType): string {
    const searchString = Object.keys(entity as unknown as Record<string, unknown>)
        .reduce((currentTerm: string, key: string) => {
            return `${currentTerm}${(entity as unknown as Record<string, unknown>)[key]}◬`;
        }, '')
        .toLowerCase();
    return searchString;
}