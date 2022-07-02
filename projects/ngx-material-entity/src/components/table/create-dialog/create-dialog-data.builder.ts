import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../../confirm-dialog/confirm-dialog-data.builder';
import { CreateDialogData } from '../table-data';

export class CreateDialogDataInternal implements CreateDialogData {
    title: string;
    createButtonLabel: string;
    cancelButtonLabel: string;
    createRequiresConfirmDialog: boolean;
    confirmCreateDialogData: ConfirmDialogDataInternal;

    constructor(
        title: string,
        createButtonLabel: string,
        cancelButtonLabel: string,
        createRequiresConfirmDialog: boolean,
        confirmCreateDialogData: ConfirmDialogDataInternal
    ) {
        this.title = title;
        this.createButtonLabel = createButtonLabel;
        this.cancelButtonLabel = cancelButtonLabel;
        this.createRequiresConfirmDialog = createRequiresConfirmDialog;
        this.confirmCreateDialogData = confirmCreateDialogData;
    }
}

export class CreateDialogDataBuilder {
    createDialogData: CreateDialogDataInternal;
    private readonly dataInput?: CreateDialogData;

    constructor(data?: CreateDialogData) {
        // this.validateInput(data);
        this.dataInput = data;
        const confirmCreateDialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(data?.confirmCreateDialogData)
            .withDefaultConfirmButtonLabel('Create')
            .withDefaultText(['Do you really want to create this entity?'])
            .withDefaultTitle('Create')
            .confirmDialogData;
        this.createDialogData = new CreateDialogDataInternal(
            data?.title ? data.title : 'Create',
            data?.createButtonLabel ? data.createButtonLabel : 'Create',
            data?.cancelButtonLabel ? data.cancelButtonLabel : 'Cancel',
            data?.createRequiresConfirmDialog ? data.createRequiresConfirmDialog : false,
            confirmCreateDialogData
        );
        return this;
    }

    withDefaultTitle(title: string): CreateDialogDataBuilder {
        if (!this.dataInput?.title) {
            this.createDialogData.title = title;
        }
        return this;
    }

    withDefaultCreateButtonLabel(label: string): CreateDialogDataBuilder {
        if (!this.dataInput?.createButtonLabel) {
            this.createDialogData.createButtonLabel = label;
        }
        return this;
    }

    withDefaultCancelButtonLabel(label: string): CreateDialogDataBuilder {
        if (!this.dataInput?.cancelButtonLabel) {
            this.createDialogData.cancelButtonLabel = label;
        }
        return this;
    }

    withDefaultCreateRequiresConfirmDialog(createRequiresConfirmDialog: boolean): CreateDialogDataBuilder {
        if (this.dataInput?.createRequiresConfirmDialog === undefined) {
            this.createDialogData.createRequiresConfirmDialog = createRequiresConfirmDialog;
        }
        return this;
    }

    withDefaultConfirmCreateDialogData(confirmCreateDialogData: ConfirmDialogDataInternal): CreateDialogDataBuilder {
        if (this.dataInput?.confirmCreateDialogData === undefined) {
            this.createDialogData.confirmCreateDialogData = confirmCreateDialogData;
        }
        return this;
    }
}