import { InjectionToken, inject } from '@angular/core';
import { NGX_GLOBAL_DEFAULT_VALUES, NgxGlobalDefaultValues } from './global-configuration-values';

// TODO space between actions and delete button in hasMany/array/references many?
// TODO space between button and validation error tooltip icon
// TODO add validation error tooltip to input.component.ts inline dialogs
// TODO fix tooltip not showing in add array item dialog.
// Its related to the top value not being correctly calculated on te edit page (is above the viewport).
// TODO update default values: Entity Array, Other Arrays

export const defaultGlobalDefaults: NgxGlobalDefaultValues = {
    createLabel: 'Create',
    editLabel: 'Edit',
    cancelLabel: 'Cancel',
    addLabel: 'Add',
    deleteLabel: 'Delete',
    backLabel: 'Back',
    actionsLabel: 'Actions',
    searchLabel: 'Search',
    dropdownTrue: 'Yes',
    dropdownFalse: 'No',
    confirmLabel: 'Confirm',
    defaultConfirmDialogText: ['Do you really want to do this?'],
    defaultConfirmDialogTitle: 'Confirmation',
    confirmSaveText: ['Do you really want to save all changes?'],
    saveLabel: 'Save',
    confirmDeleteText: ['Do you really want to delete this entity?'],
    confirmUnsavedChangesLabel: 'Leave',
    confirmUnsavedChangesTitle: 'Unsaved Changes',
    confirmUnsavedChangesText: ['You have unsaved changes that will be deleted when you leave this page.', 'Continue?'],
    addArrayItemTitle: 'Add to array',
    confirmCreateText: ['Do you really want to create this entity?'],
    confirmMultiSelectActionText: selectedEntries => [`Do you really want to run this action on ${selectedEntries.length} entries?`],
    confirmBaseActionText: ['Do you really want to run this action?'],
    confirmImportJsonText: ['Do you really want to import entities from the provided file?'],
    defaultEditMethod: 'dialog',
    emptyArrayErrorMessage: 'Needs to contain at least one value',
    removeLabel: 'Remove',
    timeLabel: 'Time',
    startLabel: 'Start',
    endLabel: 'End',
    duplicateErrorText: ['Adding duplicate entries to the array is not allowed.'],
    duplicateErrorTitle: 'Error adding duplicate item',
    editTitle: () => 'Edit',
    selectLabel: 'Select',
    addAllLabel: 'Add all'
};

export const CONFIG_NEEDS_UPDATE_KEY: string = 'NEEDS_UPDATE';

export const needsUpdateGlobalDefaults: NgxGlobalDefaultValues = {
    createLabel: CONFIG_NEEDS_UPDATE_KEY,
    editLabel: CONFIG_NEEDS_UPDATE_KEY,
    cancelLabel: CONFIG_NEEDS_UPDATE_KEY,
    addLabel: CONFIG_NEEDS_UPDATE_KEY,
    deleteLabel: CONFIG_NEEDS_UPDATE_KEY,
    backLabel: CONFIG_NEEDS_UPDATE_KEY,
    actionsLabel: CONFIG_NEEDS_UPDATE_KEY,
    searchLabel: CONFIG_NEEDS_UPDATE_KEY,
    dropdownTrue: CONFIG_NEEDS_UPDATE_KEY,
    dropdownFalse: CONFIG_NEEDS_UPDATE_KEY,
    confirmLabel: CONFIG_NEEDS_UPDATE_KEY,
    defaultConfirmDialogText: CONFIG_NEEDS_UPDATE_KEY as unknown as string[],
    defaultConfirmDialogTitle: CONFIG_NEEDS_UPDATE_KEY,
    saveLabel: CONFIG_NEEDS_UPDATE_KEY,
    confirmSaveText: CONFIG_NEEDS_UPDATE_KEY as unknown as string[],
    confirmDeleteText: CONFIG_NEEDS_UPDATE_KEY as unknown as string[],
    confirmUnsavedChangesLabel: CONFIG_NEEDS_UPDATE_KEY,
    confirmUnsavedChangesTitle: CONFIG_NEEDS_UPDATE_KEY,
    confirmUnsavedChangesText: CONFIG_NEEDS_UPDATE_KEY as unknown as string[],
    addArrayItemTitle: CONFIG_NEEDS_UPDATE_KEY,
    confirmCreateText: CONFIG_NEEDS_UPDATE_KEY as unknown as string[],
    confirmMultiSelectActionText: () => CONFIG_NEEDS_UPDATE_KEY as unknown as string[],
    confirmBaseActionText: CONFIG_NEEDS_UPDATE_KEY as unknown as string[],
    confirmImportJsonText: CONFIG_NEEDS_UPDATE_KEY as unknown as string[],
    defaultEditMethod: CONFIG_NEEDS_UPDATE_KEY as 'dialog' | 'page',
    emptyArrayErrorMessage: CONFIG_NEEDS_UPDATE_KEY,
    removeLabel: CONFIG_NEEDS_UPDATE_KEY,
    timeLabel: CONFIG_NEEDS_UPDATE_KEY,
    startLabel: CONFIG_NEEDS_UPDATE_KEY,
    endLabel: CONFIG_NEEDS_UPDATE_KEY,
    duplicateErrorText: CONFIG_NEEDS_UPDATE_KEY as unknown as string[],
    duplicateErrorTitle: CONFIG_NEEDS_UPDATE_KEY,
    editTitle: CONFIG_NEEDS_UPDATE_KEY as unknown as () => string,
    selectLabel: CONFIG_NEEDS_UPDATE_KEY,
    addAllLabel: CONFIG_NEEDS_UPDATE_KEY
};

export const NGX_INTERNAL_GLOBAL_DEFAULT_VALUES: InjectionToken<NgxGlobalDefaultValues> = new InjectionToken<NgxGlobalDefaultValues>(
    'NGX_INTERNAL_GLOBAL_DEFAULT_VALUES',
    {
        providedIn: 'root',
        factory: () => {
            const userValues: Partial<NgxGlobalDefaultValues> = inject(NGX_GLOBAL_DEFAULT_VALUES);
            return {
                ...defaultGlobalDefaults,
                ...userValues
            };
        }
    }
);