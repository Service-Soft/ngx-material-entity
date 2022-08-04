/* eslint-disable jsdoc/require-jsdoc */
import { HttpClient } from '@angular/common/http';
import { array, boolean, ConfirmDialogTypes, DecoratorTypes, Entity, EntityService, EntityUtilities, object, string } from 'ngx-material-entity';
import { EntityClassNewable } from 'projects/ngx-material-entity/src/public-api';

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

export class CreateDialogDataEntity extends Entity {
    @string({
        required: false,
        displayName: 'Create Dialog Title',
        displayStyle: 'line'
    })
    title?: string;

    @string({
        required: false,
        displayName: 'Create Dialog Create Button Label',
        displayStyle: 'line'
    })
    createButtonLabel?: string;

    @string({
        required: false,
        displayName: 'Create Dialog Cancel Button Label',
        displayStyle: 'line'
    })
    cancelButtonLabel?: string;

    @boolean({
        required: false,
        displayName: 'Create Dialog Create requires confirm?',
        displayStyle: 'dropdown',
        dropdownTrue: 'Yes',
        dropdownFalse: 'No'
    })
    createRequiresConfirmDialog?: boolean;

    @object({
        required: false,
        displayName: 'Create Dialog Confirm Create Dialog Data',
        displayStyle: 'inline',
        EntityClass: ConfirmDialogDataEntity
    })
    confirmCreateDialogData?: ConfirmDialogDataEntity;

    constructor(input: CreateDialogDataEntity) {
        super();
        EntityUtilities.new(this, input);
    }
}

export class EditDialogDataEntity<EntityType extends object> extends Entity {

    @string({
        required: false,
        displayName: 'Edit Dialog Title Method',
        displayStyle: 'line'
    })
    title?: (entity: EntityType) => string;

    @string({
        required: false,
        displayName: 'Edit Dialog Confirm Button Label',
        displayStyle: 'line'
    })
    confirmButtonLabel?: string;

    @string({
        required: false,
        displayName: 'Edit Dialog Delete Button Label',
        displayStyle: 'line'
    })
    deleteButtonLabel?: string;

    @string({
        required: false,
        displayName: 'Edit Dialog Cancel Button Label',
        displayStyle: 'line'
    })
    cancelButtonLabel?: string;

    @boolean({
        required: false,
        displayName: 'Edit Dialog Delete requires confirm?',
        displayStyle: 'dropdown',
        dropdownTrue: 'Yes',
        dropdownFalse: 'No'
    })
    deleteRequiresConfirmDialog?: boolean;

    @boolean({
        required: false,
        displayName: 'Edit Dialog Edit requires confirm?',
        displayStyle: 'dropdown',
        dropdownTrue: 'Yes',
        dropdownFalse: 'No'
    })
    editRequiresConfirmDialog?: boolean;

    @object({
        required: false,
        displayName: 'Edit Dialog Confirm Delete Dialog Data',
        displayStyle: 'inline',
        EntityClass: ConfirmDialogDataEntity
    })
    confirmDeleteDialogData?: ConfirmDialogDataEntity;

    @object({
        required: false,
        displayName: 'Edit Dialog Confirm Edit Dialog Data',
        displayStyle: 'inline',
        EntityClass: ConfirmDialogDataEntity
    })
    confirmEditDialogData?: ConfirmDialogDataEntity;

    constructor(input: EditDialogDataEntity<EntityType>) {
        super();
        EntityUtilities.new(this, input);
    }
}

export class DisplayColumnEntity<EntityType extends object> extends Entity {
    @string({
        displayName: 'Display Column Display Name',
        displayStyle: 'line'
    })
    displayName!: string;

    @string({
        displayName: 'Display Column Value method',
        displayStyle: 'line'
    })
    value!: (entity: EntityType) => string;

    constructor(input: DisplayColumnEntity<EntityType>) {
        super();
        EntityUtilities.new(this, input);
    }
}

export class MultiSelectActionEntity<EntityType extends object> extends Entity {
    @string({
        displayName: 'Multi Select Display Name',
        displayStyle: 'line'
    })
    displayName!: string;

    @string({
        displayName: 'Multi Select Action Method',
        displayStyle: 'line'
    })
    action!: (selectedEntities: EntityType[]) => unknown;

    @string({
        required: false,
        displayName: 'Multi Select Enabled? Method',
        displayStyle: 'line'
    })
    enabled?: (selectedEntities: EntityType[]) => boolean;

    @string({
        required: false,
        displayName: 'Multi Select Require ConfirmDialog? Method',
        displayStyle: 'line'
    })
    requireConfirmDialog?: (selectedEntities: EntityType[]) => boolean;

    @object({
        required: false,
        displayName: 'Multi Select Confirm Dialog Data',
        displayStyle: 'inline',
        EntityClass: ConfirmDialogDataEntity,
        defaultWidths: [12, 12, 12]
    })
    confirmDialogData?: ConfirmDialogDataEntity;

    constructor(input: MultiSelectActionEntity<EntityType>) {
        super();
        EntityUtilities.new(this, input);
    }
}

export class BaseDataEntity<EntityType extends object> extends Entity {
    @string({
        displayName: 'Base Data Title',
        displayStyle: 'line'
    })
    title!: string;

    @array({
        displayName: 'Base Data Display Columns',
        displayStyle: 'table',
        itemType: DecoratorTypes.OBJECT,
        EntityClass: DisplayColumnEntity,
        displayColumns: [
            {
                displayName: 'Name',
                value: (e: DisplayColumnEntity<EntityType>) => e.displayName
            }
        ],
        addButtonLabel: 'Add Display Column',
        removeButtonLabel: 'Remove Display Column'
    })
    displayColumns!: DisplayColumnEntity<EntityType>[];

    @string({
        displayName: 'Base Data Entity Service Class',
        displayStyle: 'line'
    })
    EntityServiceClass!: new (httpClient: HttpClient) => EntityService<EntityType>;

    @string({
        required: false,
        displayName: 'Base Data Entity Class',
        displayStyle: 'line'
    })
    EntityClass?: EntityClassNewable<EntityType>;

    @string({
        required: false,
        displayName: 'Base Data Search Label',
        displayStyle: 'line'
    })
    searchLabel?: string;

    @string({
        required: false,
        displayName: 'Base Data Create Button Label',
        displayStyle: 'line'
    })
    createButtonLabel?: string;

    @string({
        required: false,
        displayName: 'Base Data Custom edit method',
        displayStyle: 'line'
    })
    edit?: (entity: EntityType) => unknown;

    @string({
        required: false,
        displayName: 'Base Data Custom create method',
        displayStyle: 'line'
    })
    create?: (entity: EntityType) => unknown;

    @string({
        required: false,
        displayName: 'Base Data Custom search string method',
        displayStyle: 'line'
    })
    searchString?: (entity: EntityType) => string;

    @boolean({
        required: false,
        displayName: 'Base Data Allow create?',
        displayStyle: 'dropdown',
        dropdownTrue: 'Yes',
        dropdownFalse: 'No'
    })
    allowCreate?: boolean;

    @string({
        required: false,
        displayName: 'Base Data Custom allow edit method',
        displayStyle: 'line'
    })
    allowEdit?: (entity: EntityType) => boolean;

    @string({
        required: false,
        displayName: 'Base Data Custom allow delete method',
        displayStyle: 'line'
    })
    allowDelete?: (entity: EntityType) => boolean;

    @array({
        required: false,
        displayName: 'Base Data Multi Select Actions',
        displayStyle: 'table',
        itemType: DecoratorTypes.OBJECT,
        EntityClass: MultiSelectActionEntity,
        displayColumns: [
            {
                displayName: 'Name',
                value: (e: MultiSelectActionEntity<EntityType>) => e.displayName
            }
        ],
        addButtonLabel: 'Add MSA',
        removeButtonLabel: 'Remove MSA'
    })
    multiSelectActions?: MultiSelectActionEntity<EntityType>[];

    @string({
        required: false,
        displayName: 'Base Data Multi Select Label',
        displayStyle: 'line'
    })
    multiSelectLabel?: string;

    constructor(input: BaseDataEntity<EntityType>) {
        super();
        EntityUtilities.new(this, input);
    }
}

export class TableDataEntity<EntityType extends object> extends Entity {
    @object({
        displayName: 'Base Data',
        displayStyle: 'inline',
        EntityClass: BaseDataEntity,
        defaultWidths: [12, 12, 12]
    })
    baseData!: BaseDataEntity<EntityType>;

    @object({
        required: false,
        displayName: 'Create Dialog Data',
        displayStyle: 'inline',
        EntityClass: CreateDialogDataEntity,
        defaultWidths: [12, 12, 12],
    })
    createDialogData?: CreateDialogDataEntity;

    @object({
        required: false,
        displayName: 'Edit Dialog Data',
        displayStyle: 'inline',
        EntityClass: EditDialogDataEntity,
        defaultWidths: [12, 12, 12]
    })
    editDialogData?: EditDialogDataEntity<EntityType>;

    constructor(input: TableDataEntity<EntityType>) {
        super();
        EntityUtilities.new(this, input);
    }
}