import { ConfirmDialogData, ConfirmDialogTypes } from './confirm-dialog-data';

export class ConfirmDialogDataInternal implements ConfirmDialogData {
    text: string[];
    type: ConfirmDialogTypes;
    confirmButtonLabel: string;
    cancelButtonLabel: string;
    title: string;
    requireConfirmation: boolean;
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

export class ConfirmDialogDataBuilder {
    confirmDialogData: ConfirmDialogDataInternal;
    private readonly dataInput?: ConfirmDialogData;

    constructor(data?: ConfirmDialogData) {
        this.validateInput(data);
        this.dataInput = data;
        this.confirmDialogData = new ConfirmDialogDataInternal(
            data?.text ? data.text : ['Do you really want to do this?'],
            data?.type ? data.type : 'default',
            data?.confirmButtonLabel ? data.confirmButtonLabel : 'Confirm',
            data?.cancelButtonLabel ? data.cancelButtonLabel : 'Cancel',
            data?.title ? data.title : 'Confirmation',
            data?.requireConfirmation ? data.requireConfirmation : false,
            data?.confirmationText
        );
        return this;
    }

    private validateInput(data?: ConfirmDialogData): void {
        if (!data) {
            return;
        }
        if (data.requireConfirmation && !data.confirmationText) {
            throw new Error(`Missing required Input data "confirmationText".
            You can only omit this value when "requireConfirmation" is false.`);
        }
        if (!data.requireConfirmation && data.confirmationText) {
            throw new Error('The "confirmationText" will never be shown because "requireConfirmation" is not set to true');
        }
        if (data.type === 'info-only' && data.cancelButtonLabel) {
            throw new Error('The "cancelButtonLabel" will never be shown because "type" is set to "info-only"');
        }
    }

    withDefaultText(text: string[]): ConfirmDialogDataBuilder {
        if (!this.dataInput?.text) {
            this.confirmDialogData.text = text;
        }
        return this;
    }

    withDefaultType(type: ConfirmDialogTypes): ConfirmDialogDataBuilder {
        if (!this.dataInput?.type) {
            this.confirmDialogData.type = type;
        }
        return this;
    }

    withDefaultConfirmButtonLabel(label: string): ConfirmDialogDataBuilder {
        if (!this.dataInput?.confirmButtonLabel) {
            this.confirmDialogData.confirmButtonLabel = label;
        }
        return this;
    }

    withDefaultCancelButtonLabel(label: string): ConfirmDialogDataBuilder {
        if (!this.dataInput?.cancelButtonLabel) {
            this.confirmDialogData.cancelButtonLabel = label;
        }
        return this;
    }

    withDefaultTitle(title: string): ConfirmDialogDataBuilder {
        if (!this.dataInput?.title) {
            this.confirmDialogData.title = title;
        }
        return this;
    }

    withDefaultRequireConfirmation(requireConfirmation: boolean): ConfirmDialogDataBuilder {
        if (this.dataInput?.requireConfirmation === undefined) {
            this.confirmDialogData.requireConfirmation = requireConfirmation;
        }
        return this;
    }

    withDefaultConfirmationText(confirmationText: string): ConfirmDialogDataBuilder {
        if (!this.dataInput?.confirmationText) {
            this.confirmDialogData.confirmationText = confirmationText;
        }
        return this;
    }
}