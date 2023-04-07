import { BaseBuilder } from '../../classes/base.builder';
import { ConfirmDialogData, ConfirmDialogTypes } from './confirm-dialog-data';

/**
 * The internal ConfirmDialogData. Requires all default values the user can leave out.
 */
export class ConfirmDialogDataInternal implements ConfirmDialogData {
    // eslint-disable-next-line jsdoc/require-jsdoc
    text: string[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    type: ConfirmDialogTypes;
    // eslint-disable-next-line jsdoc/require-jsdoc
    confirmButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    cancelButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    title: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    requireConfirmation: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    confirmationText?: string;

    constructor(
        text: string[],
        type: ConfirmDialogTypes,
        confirmButtonLabel: string,
        cancelButtonLabel: string,
        title: string,
        requireConfirmation: boolean,
        confirmationText?: string
    ) {
        this.text = text;
        this.type = type;
        this.confirmButtonLabel = confirmButtonLabel;
        this.cancelButtonLabel = cancelButtonLabel;
        this.title = title;
        this.requireConfirmation = requireConfirmation;
        this.confirmationText = confirmationText;
    }
}

/**
 * The Builder for the ConfirmDialogData. Sets default values.
 */
export class ConfirmDialogDataBuilder extends BaseBuilder<ConfirmDialogDataInternal, ConfirmDialogData> {

    constructor(data?: ConfirmDialogData) {
        super(data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected override generateBaseData(data?: ConfirmDialogData): ConfirmDialogDataInternal {
        return new ConfirmDialogDataInternal(
            data?.text ?? ['Do you really want to do this?'],
            data?.type ?? 'default',
            data?.confirmButtonLabel ?? 'Confirm',
            data?.cancelButtonLabel ?? 'Cancel',
            data?.title ?? 'Confirmation',
            data?.requireConfirmation ?? false,
            data?.confirmationText
        );
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected override validateInput(data?: ConfirmDialogData): void {
        if (!data) {
            return;
        }
        if (data.requireConfirmation === true && !data.confirmationText) {
            // eslint-disable-next-line max-len
            throw new Error('Missing required Input data "confirmationText". You can only omit this value when "requireConfirmation" is false.');
        }
        if (data.requireConfirmation !== true && data.confirmationText) {
            throw new Error('The "confirmationText" will never be shown because "requireConfirmation" is not set to true');
        }
        if (data.type === 'info-only' && data.cancelButtonLabel) {
            throw new Error('The "cancelButtonLabel" will never be shown because "type" is set to "info-only"');
        }
    }
}