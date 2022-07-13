/**
 * The different types of a confirm dialog.
 * Is used for displaying different buttons accordingly.
 */
export type ConfirmDialogTypes = 'default' | 'delete' | 'info-only';

/**
 * The Definition of the Confirm Dialog Data.
 */
export interface ConfirmDialogData {
    /**
     * An array of paragraphs to display inside the dialog body.
     */
    text?: string[],
    /**
     * The type of the Confirm Dialog. Changes the button layout. Can be either:
     *
     * 'default': A confirm- and a cancel-button.
     *
     * 'delete': Like default but the confirm-button is red.
     *
     * 'info-only': Only a cancel-button.
     */
    type?: ConfirmDialogTypes,
    /**
     * The label of the button that confirms the dialog.
     * In case of the 'delete' Dialog this is the string that is shown on the delete-button.
     *
     * @default 'Confirm' or 'Delete', depending on the type
     */
    confirmButtonLabel?: string,
    /**
     * The label of the button that closes the dialog without doing anything.
     *
     * @default 'Cancel'
     */
    cancelButtonLabel?: string,
    /**
     * The title of the dialog.
     */
    title?: string,
    /**
     * Whether or not a checkbox needs to be selected before the user can confirm the dialog.
     *
     * @default false
     */
    requireConfirmation?: boolean,
    /**
     * The text to display on the checkbox if 'requireConfirmation' is set to true.
     */
    confirmationText?: string
}