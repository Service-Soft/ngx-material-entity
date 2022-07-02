import { HttpClient } from '@angular/common/http'
import { Entity } from '../../classes/entity-model.class'
import { EntityService } from '../../classes/entity-service.class'
import { ConfirmDialogData } from '../confirm-dialog/confirm-dialog-data'

/**
 * The Definition of a Column inside the table.
 */
export interface DisplayColumn<EntityType extends Entity> {
    /**
     * The name inside the header.
     */
    displayName: string,
    /**
     * A method to get the value inside an row
     */
    value: (entity: EntityType) => string
}

/**
 * The Definition of an Action that can be run on multiple selected entities
 */
export interface MultiSelectAction<EntityType extends Entity> {
    /**
     * The name of the action
     */
    displayName: string,
    /**
     * The action itself
     */
    action: (selectedEntities: EntityType[]) => unknown,
    /**
     * A method that defines whether or not the action can be used.
     * @default true
     */
    enabled?: (selectedEntities: EntityType[]) => boolean,
    /**
     * A method that defines whether or not a confirm dialog is needed to run the action
     * @default false
     */
    requireConfirmDialog?: (selectedEntities: EntityType[]) => boolean,
    /**
     * The data used to generate a confirmation dialog for the multiselect action.
     */
    confirmDialogData?: ConfirmDialogData
}

export interface BaseData<EntityType extends Entity> {
    /**
     * The title of the table
     */
    title: string,
    /**
     * The definition of the columns to display. Consists of the displayName to show in the header of the row
     * and the value, which is a function that generates the value to display inside a column
     */
    displayColumns: DisplayColumn<EntityType>[],
    /**
     * The Class of the service that handles the entities.
     * Needs to be injectable and an extension of the "EntityService"-Class
     */
    EntityServiceClass: new (httpClient: HttpClient) => EntityService<EntityType>,
    /**
     * The Class of the entities to manage
     */
    EntityClass?: new (entity?: EntityType) => EntityType,
    /**
     * The label on the search bar. Defaults to "Search".
     */
    searchLabel?: string,
    /**
     * The label on the button for adding new entities. Defaults to "Create".
     */
    createButtonLabel?: string,
    /**
     * Takes a custom edit method which runs when you click on a entity.
     * If you don't need any special editing of entries you can also omit this.
     * In that case a default edit dialog is generated.
     */
    edit?: (entity: EntityType) => unknown,
    /**
     * Takes a method to run when you click on the new button.
     * If you don't need anything special you can also omit this.
     * In that case a default create dialog is generated.
     */
    create?: (entity: EntityType) => unknown,
    /**
     * Defines how the search string of entities is generated.
     */
    searchString?: (enity: EntityType) => string,
    /**
     * Defines whether or not the user can add new entities.
     * @default true
     */
    allowCreate?: boolean,
    /**
     * Defines whether or not the user can edit entities.
     * @default () => true
     */
    allowEdit?: (entity: EntityType) => boolean,
    /**
     * Whether or not the user can delete this specific entity
     */
    allowDelete?: (entity: EntityType) => boolean,
    /**
     * All Actions that you want to run on multiple entities can be defined here.
     * (e.g. download as zip-file or mass delete)
     */
    multiSelectActions?: MultiSelectAction<EntityType>[],
    /**
     * The Label for the button that opens all multi-actions.
     */
    multiSelectLabel?: string
}

export interface CreateDialogData {
    /**
     * The title of the default create-dialog.
     */
    title?: string,
    /**
     * The label on the create-button of the default create-dialog. Defaults to "Create".
     */
    createButtonLabel?: string,
    /**
     * The label on the cancel-button for the default create-dialog. Defaults to "Cancel".
     */
    cancelButtonLabel?: string,
    /**
     * Whether or not the creation of an entry should require a confirm dialog.
     */
    createRequiresConfirmDialog?: boolean,
    /**
     * The data used to generate a confirmation dialog for the create action.
     */
    confirmCreateDialogData?: ConfirmDialogData
}

export interface EditDialogData<EntityType extends Entity> {
    /**
     * The title of the default edit-dialog.
     */
    title?: (entity: EntityType) => string,
    /**
     * The label on the confirm-button of the default edit-dialog. Defaults to "Save".
     */
    confirmButtonLabel?: string,
    /**
     * The label on the delete-button of the default edit-dialog. Defaults to "Delete".
     */
    deleteButtonLabel?: string,
    /**
     * The label on the cancel-button for the default edit-dialog. Defaults to "Cancel".
     */
    cancelButtonLabel?: string,
    /**
     * Whether or not the deletion of an entry should require a confirm dialog.
     */
    deleteRequiresConfirmDialog?: boolean,
    /**
     * Whether or not the editing of an entry should require a confirm dialog.
     */
    editRequiresConfirmDialog?: boolean,

    /**
     * The data used to generate a confirmation dialog for the delete action.
     */
    confirmDeleteDialogData?: ConfirmDialogData,

    /**
     * The data used to generate a confirmation dialog for the delete action.
     */
    confirmEditDialogData?: ConfirmDialogData
}

export interface TableData<EntityType extends Entity> {
    /**
     * The base data for the table-component.
     * Includes stuff like the title for the table, what to display inside the rows etc.
     */
    baseData: BaseData<EntityType>,
    /**
     * The data for the default create-dialog.
     * Can be omitted when specifying a custom "create" method inside the baseData.
     */
    createDialogData?: CreateDialogData,
    /**
     * The data for the default edit-dialog.
     * Can be omitted when specifying a custom "edit" method inside the baseData.
     */
    editDialogData?: EditDialogData<EntityType>
}