export type ConfirmDialogTypes = 'default' | 'delete' | 'info-only';

export interface ConfirmDialogData {
    text: string[],
    type: ConfirmDialogTypes,
    confirmButtonLabel?: string,
    cancelButtonLabel?: string,
    title?: string,
    requireConfirmation?: boolean,
    confirmationText?: string
}