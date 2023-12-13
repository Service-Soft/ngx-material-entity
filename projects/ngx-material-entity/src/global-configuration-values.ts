/* istanbul ignore file */
import { InjectionToken } from '@angular/core';

/**
 * All configurable default values.
 */
export interface NgxGlobalDefaultValues {
    /**
     * The label for create buttons.
     * @default 'Create'
     */
    createLabel: string,
    /**
     * The label for edit buttons.
     * @default 'Edit'
     */
    editLabel: string,
    /**
     * The label for save buttons.
     * @default 'Save'
     */
    saveLabel: string,
    /**
     * The label for cancel buttons.
     * @default 'Cancel'
     */
    cancelLabel: string,
    /**
     * The label for add buttons.
     * @default 'Add'
     */
    addLabel: string,
    /**
     * The label for delete buttons.
     * @default 'Delete'
     */
    deleteLabel: string,
    /**
     * The label for back buttons.
     * @default 'Back'
     */
    backLabel: string,
    /**
     * The label for actions.
     * @default 'Actions'
     */
    actionsLabel: string,
    /**
     * The label for searches.
     * @default 'Search'
     */
    searchLabel: string,
    /**
     * The display value for the "true" value in dropdowns.
     * @default 'Yes'
     */
    dropdownTrue: string,
    /**
     * The display value for the "false" value in dropdowns.
     * @default 'No'
     */
    dropdownFalse: string,
    /**
     * The label for confirm buttons.
     * @default 'Confirm'
     */
    confirmLabel: string,
    /**
     * The title for a confirm dialog.
     * @default 'Confirmation'
     */
    defaultConfirmDialogTitle: string,
    /**
     * The text for a confirm dialog.
     * @default ['Do you really want to do this?']
     */
    defaultConfirmDialogText: string[],
    /**
     * The text for confirming a save action.
     * @default ['Do you really want to save all changes?']
     */
    confirmSaveText: string[],
    /**
     * The text for confirming a delete action.
     * @default ['Do you really want to delete this entity?']
     */
    confirmDeleteText: string[],
    /**
     * The label for the button to leave without changes.
     * @default 'Leave'
     */
    confirmUnsavedChangesLabel: string,
    /**
     * The title for confirming to leave without changes.
     * @default 'Unsaved Changes'
     */
    confirmUnsavedChangesTitle: string,
    /**
     * The text for confirming to leave without changes.
     * @default ['You have unsaved changes that will be deleted when you leave this page.', 'Continue?']
     */
    confirmUnsavedChangesText: string[],
    /**
     * The title for the add array item dialog.
     * @default 'Add to array'
     */
    addArrayItemTitle: string,
    /**
     * The text for confirming a create action.
     * @default ['Do you really want to create this entity?']
     */
    confirmCreateText: string[],
    /**
     * The text for confirming a multi select action.
     * @default selectedEntries => [`Do you really want to run this action on ${selectedEntries.length} entries?`]
     */
    confirmMultiSelectActionText: (selectedEntries: unknown[]) => string[],
    /**
     * The text for confirming a base action.
     * @default ['Do you really want to run this action?']
     */
    confirmBaseActionText: string[],
    /**
     * The text for confirming the json import.
     * @default ['Do you really want to import entities from the provided file?']
     */
    confirmImportJsonText: string[],
    /**
     * How table entities are edited by default.
     * @default 'dialog'
     */
    defaultEditMethod: 'dialog' | 'page',
    /**
     * How table entities are created by default.
     * @default 'dialog'
     */
    defaultCreateMethod: 'dialog' | 'page',
    /**
     * The error message to display when an array property is required and empty.
     * @default 'Needs to contain at least one value'
     */
    emptyArrayErrorMessage: string,
    /**
     * The label for remove actions.
     * @default 'Remove'
     */
    removeLabel: string,
    /**
     * The label for time values.
     * Mainly used inside date properties.
     * @default 'Time'
     */
    timeLabel: string,
    /**
     * The label for the date range start.
     * @default 'Start'
     */
    startLabel: string,
    /**
     * The label for the date range end.
     * @default 'End'
     */
    endLabel: string,
    /**
     * The error text for duplicate entries inside an array.
     * @default ['Adding duplicate entries to the array is not allowed.']
     */
    duplicateErrorText: string[],
    /**
     * The error title for duplicate entries inside an array.
     * @default 'Error adding duplicate item'
     */
    duplicateErrorTitle: string,
    /**
     * The title for editing an entities.
     * @default () => 'Edit'
     */
    editTitle: (entity: unknown) => string,
    /**
     * The label for an select action, eg. Dropdowns.
     * @default 'Select'
     */
    selectLabel: string,
    /**
     * The label for an "Add all" button.
     * @default 'Add all'
     */
    addAllLabel: string

}


/**
 * The provider for global configuration values.
 */
export const NGX_GLOBAL_DEFAULT_VALUES: InjectionToken<Partial<NgxGlobalDefaultValues>> = new InjectionToken<Partial<NgxGlobalDefaultValues>>(
    'NGX_GLOBAL_DEFAULT_VALUES',
    {
        providedIn: 'root',
        factory: () => {
            return {};
        }
    }
);