/* eslint-disable jsdoc/require-jsdoc */
import { HttpClient } from '@angular/common/http';
import { array, boolean, ConfirmDialogTypes, DecoratorTypes, Entity, EntityService, EntityUtilities, object, string } from 'ngx-material-entity';

class ConfirmDialogDataEntity extends Entity {
    @array({
        required: false,
        displayName: 'Text Paragraphs',
        displayStyle: 'chips',
        itemType: DecoratorTypes.STRING,
    })
    text?: string[];

    @string({
        required: false,
        displayName: 'Type',
        displayStyle: 'dropdown',
        dropdownValues: [
            {
                displayName: 'Default',
                value: 'default'
            },
            {
                displayName: 'Delete',
                value: 'delete'
            },
            {
                displayName: 'Info only',
                value: 'info-only'
            }
        ]
    })
    type?: ConfirmDialogTypes;

    @string({
        required: false,
        displayName: 'Confirm Button Label',
        displayStyle: 'line'
    })
    confirmButtonLabel?: string;

    @string({
        required: false,
        displayName: 'Cancel Button Label',
        displayStyle: 'line'
    })
    cancelButtonLabel?: string;

    @string({
        required: false,
        displayName: 'Title',
        displayStyle: 'line'
    })
    title?: string;

    @boolean({
        required: false,
        displayName: 'Require confirmation?',
        displayStyle: 'dropdown',
        dropdownTrue: 'Yes',
        dropdownFalse: 'No'
    })
    requireConfirmation?: boolean;

    @string({
        required: false,
        displayName: 'Confirmation Text',
        displayStyle: 'line'
    })
    confirmationText?: string;

    constructor(input: ConfirmDialogDataEntity) {
        super();
        EntityUtilities.new(this, input);
    }
}

class CreateDialogDataEntity extends Entity {
    @string({
        required: false,
        displayName: 'Title',
        displayStyle: 'line'
    })
    title?: string;

    @string({
        required: false,
        displayName: 'Create Button Label',
        displayStyle: 'line'
    })
    createButtonLabel?: string;

    @string({
        required: false,
        displayName: 'Cancel Button Label',
        displayStyle: 'line'
    })
    cancelButtonLabel?: string;

    @boolean({
        required: false,
        displayName: 'Create requires confirm?',
        displayStyle: 'dropdown',
        dropdownTrue: 'Yes',
        dropdownFalse: 'No'
    })
    createRequiresConfirmDialog?: boolean;

    @object({
        required: false,
        displayName: 'Confirm Create Dialog Data',
        displayStyle: 'inline',
        type: ConfirmDialogDataEntity as (new (entity?: ConfirmDialogDataEntity) => ConfirmDialogDataEntity)
    })
    confirmCreateDialogData?: ConfirmDialogDataEntity;

    constructor(input: CreateDialogDataEntity) {
        super();
        EntityUtilities.new(this, input);
    }
}

class EditDialogDataEntity<EntityType extends Entity> extends Entity {

    @string({
        required: false,
        displayName: 'Title Method',
        displayStyle: 'line'
    })
    title?: (entity: EntityType) => string;

    @string({
        required: false,
        displayName: 'Confirm Button Label',
        displayStyle: 'line'
    })
    confirmButtonLabel?: string;

    @string({
        required: false,
        displayName: 'Delete Button Label',
        displayStyle: 'line'
    })
    deleteButtonLabel?: string;

    @string({
        required: false,
        displayName: 'Cancel Button Label',
        displayStyle: 'line'
    })
    cancelButtonLabel?: string;

    @boolean({
        required: false,
        displayName: 'Delete requires confirm?',
        displayStyle: 'dropdown',
        dropdownTrue: 'Yes',
        dropdownFalse: 'No'
    })
    deleteRequiresConfirmDialog?: boolean;

    @boolean({
        required: false,
        displayName: 'Edit requires confirm?',
        displayStyle: 'dropdown',
        dropdownTrue: 'Yes',
        dropdownFalse: 'No'
    })
    editRequiresConfirmDialog?: boolean;

    @object({
        required: false,
        displayName: 'Confirm Delete Dialog Data',
        displayStyle: 'inline',
        type: ConfirmDialogDataEntity as (new (entity?: ConfirmDialogDataEntity) => ConfirmDialogDataEntity)
    })
    confirmDeleteDialogData?: ConfirmDialogDataEntity;

    @object({
        required: false,
        displayName: 'Confirm Edit Dialog Data',
        displayStyle: 'inline',
        type: ConfirmDialogDataEntity as (new (entity?: ConfirmDialogDataEntity) => ConfirmDialogDataEntity)
    })
    confirmEditDialogData?: ConfirmDialogDataEntity;

    constructor(input: EditDialogDataEntity<EntityType>) {
        super();
        EntityUtilities.new(this, input);
    }
}

class DisplayColumnEntity<EntityType extends Entity> extends Entity {
    @string({
        displayName: 'Display Name',
        displayStyle: 'line'
    })
    displayName!: string;

    @string({
        displayName: 'Value method',
        displayStyle: 'line'
    })
    value!: (entity: EntityType) => string;

    constructor(input: DisplayColumnEntity<EntityType>) {
        super();
        EntityUtilities.new(this, input);
    }
}

class MultiSelectActionEntity<EntityType extends Entity> extends Entity {
    @string({
        displayName: 'Display Name',
        displayStyle: 'line'
    })
    displayName!: string;

    @string({
        displayName: 'Action Method',
        displayStyle: 'line'
    })
    action!: (selectedEntities: EntityType[]) => unknown;

    @string({
        required: false,
        displayName: 'Enabled? Method',
        displayStyle: 'line'
    })
    enabled?: (selectedEntities: EntityType[]) => boolean;

    @string({
        required: false,
        displayName: 'Require ConfirmDialog? Method',
        displayStyle: 'line'
    })
    requireConfirmDialog?: (selectedEntities: EntityType[]) => boolean;

    @object({
        required: false,
        displayName: 'Confirm Dialog Data',
        displayStyle: 'inline',
        type: ConfirmDialogDataEntity as (new (entity?: ConfirmDialogDataEntity) => ConfirmDialogDataEntity)
    })
    confirmDialogData?: ConfirmDialogDataEntity;

    constructor(input: MultiSelectActionEntity<EntityType>) {
        super();
        EntityUtilities.new(this, input);
    }
}

class BaseDataEntity<EntityType extends Entity> extends Entity {
    @string({
        displayName: 'Title',
        displayStyle: 'line'
    })
    title!: string;

    @array({
        displayName: 'Display Columns',
        displayStyle: 'table',
        itemType: DecoratorTypes.OBJECT,
        EntityClass: DisplayColumnEntity as unknown as (new (entity?: EntityType) => EntityType),
        displayColumns: [
            {
                displayName: 'Name',
                value: ((e: DisplayColumnEntity<EntityType>) =>  e.displayName) as unknown as ((entity: EntityType) => string)
            }
        ]
    })
    displayColumns!: DisplayColumnEntity<EntityType>[];

    @string({
        displayName: 'Entity Service Class',
        displayStyle: 'line'
    })
    EntityServiceClass!: new (httpClient: HttpClient) => EntityService<EntityType>;

    @string({
        required: false,
        displayName: 'Entity Class',
        displayStyle: 'line'
    })
    EntityClass?: new (entity?: EntityType) => EntityType;

    @string({
        required: false,
        displayName: 'Search Label',
        displayStyle: 'line'
    })
    searchLabel?: string;

    @string({
        required: false,
        displayName: 'Create Button Label',
        displayStyle: 'line'
    })
    createButtonLabel?: string;

    @string({
        required: false,
        displayName: 'Custom edit method',
        displayStyle: 'line'
    })
    edit?: (entity: EntityType) => unknown;

    @string({
        required: false,
        displayName: 'Custom create method',
        displayStyle: 'line'
    })
    create?: (entity: EntityType) => unknown;

    @string({
        required: false,
        displayName: 'Custom search string method',
        displayStyle: 'line'
    })
    searchString?: (entity: EntityType) => string;

    @boolean({
        required: false,
        displayName: 'Allow create?',
        displayStyle: 'dropdown',
        dropdownTrue: 'Yes',
        dropdownFalse: 'No'
    })
    allowCreate?: boolean;

    @string({
        required: false,
        displayName: 'Custom allow edit method',
        displayStyle: 'line'
    })
    allowEdit?: (entity: EntityType) => boolean;

    @string({
        required: false,
        displayName: 'Custom allow delete method',
        displayStyle: 'line'
    })
    allowDelete?: (entity: EntityType) => boolean;

    @array({
        required: false,
        displayName: 'Multi Select Actions',
        displayStyle: 'table',
        itemType: DecoratorTypes.OBJECT,
        EntityClass: MultiSelectActionEntity as unknown as (new (entity?: EntityType) => EntityType),
        displayColumns: [
            {
                displayName: 'Name',
                value: ((e: MultiSelectActionEntity<EntityType>) => e.displayName) as unknown as ((entity: EntityType) => string)
            }
        ]
    })
    multiSelectActions?: MultiSelectActionEntity<EntityType>[];

    @string({
        required: false,
        displayName: 'Multi Select Label',
        displayStyle: 'line'
    })
    multiSelectLabel?: string;

    constructor(input: BaseDataEntity<EntityType>) {
        super();
        EntityUtilities.new(this, input);
    }
}

export class TableDataEntity<EntityType extends Entity> extends Entity {
    @object({
        displayName: 'Base Data',
        displayStyle: 'inline',
        type: BaseDataEntity as unknown as (new (entity?: EntityType) => EntityType),
        defaultWidths: [12, 12, 12]
    })
    baseData!: BaseDataEntity<EntityType>;

    @object({
        required: false,
        displayName: 'Create Dialog Data',
        displayStyle: 'inline',
        type: CreateDialogDataEntity as (new (entity?: CreateDialogDataEntity) => CreateDialogDataEntity),
        defaultWidths: [12, 12, 12]
    })
    createDialogData?: CreateDialogDataEntity;

    @object({
        required: false,
        displayName: 'Edit Dialog Data',
        displayStyle: 'inline',
        type: EditDialogDataEntity as (new (entity?: EditDialogDataEntity<EntityType>) => EditDialogDataEntity<EntityType>),
        defaultWidths: [12, 12, 12]
    })
    editDialogData?: EditDialogDataEntity<EntityType>;

    constructor(input: TableDataEntity<EntityType>) {
        super();
        EntityUtilities.new(this, input);
    }
}