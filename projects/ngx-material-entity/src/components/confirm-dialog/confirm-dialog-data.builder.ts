import { BaseBuilder } from '../../classes/base.builder';
import { CONFIG_NEEDS_UPDATE_KEY } from '../../default-global-configuration-values';
import { getConfigValue } from '../../functions/get-config-value.function';
import { NgxGlobalDefaultValues } from '../../global-configuration-values';
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

    constructor(globalConfig: NgxGlobalDefaultValues, data?: ConfirmDialogData) {
        super(globalConfig, data);
    }


    protected override generateBaseData(data?: ConfirmDialogData): ConfirmDialogDataInternal {
        return new ConfirmDialogDataInternal(
            getConfigValue(this.globalConfig.defaultConfirmDialogText, data?.text),
            data?.type ?? 'default',
            getConfigValue(this.globalConfig.confirmLabel, data?.confirmButtonLabel),
            getConfigValue(this.globalConfig.cancelLabel, data?.cancelButtonLabel),
            getConfigValue(this.globalConfig.defaultConfirmDialogTitle, data?.title),
            data?.requireConfirmation ?? false,
            data?.confirmationText
        );
    }


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
        if (data.type === 'info-only' && data.cancelButtonLabel && data.cancelButtonLabel !== CONFIG_NEEDS_UPDATE_KEY) {
            throw new Error('The "cancelButtonLabel" will never be shown because "type" is set to "info-only"');
        }
    }
}