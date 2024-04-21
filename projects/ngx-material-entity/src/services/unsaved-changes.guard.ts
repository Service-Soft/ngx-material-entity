import { CanDeactivateFn } from '@angular/router';

/**
 * Interface definition for a page that can work with the UnsavedChangesGuard.
 */
export interface UnsavedChangesPage {
    /**
     * Whether the page can be left without confirmation of unsaved changes.
     * @returns Whether or not the page can be left without confirmation.
     */
    canDeactivate: () => boolean,
    /**
     * Opens the confirm dialog for navigating with unsaved changes.
     * @returns The the promise boolean result of the confirm dialog.
     */
    openConfirmNavigationDialog: () => Promise<boolean>
}

/**
 * A guard that checks if the user has unsaved changes and then prompts a confirmation from him.
 * Is used by the ngx-material-entity edit and create pages.
 * @param component - The component, can be either an edit or create page.
 * @returns An observable containing whether or not the user can continue.
 */
export const UnsavedChangesGuard: CanDeactivateFn<UnsavedChangesPage> = async (component: UnsavedChangesPage) => {
    if (component.canDeactivate()) {
        return true;
    }
    return await component.openConfirmNavigationDialog();
};