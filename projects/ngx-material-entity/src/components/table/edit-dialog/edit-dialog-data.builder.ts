import { Entity } from '../../../classes/entity-model.class';
import { ConfirmDialogData } from '../../confirm-dialog/confirm-dialog-data';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../../confirm-dialog/confirm-dialog-data.builder';
import { EditDialogData } from '../table-data';

export class EditDialogDataInternal<EntityType extends Entity> implements EditDialogData<EntityType> {
    title: (entity: EntityType) => string;
    confirmButtonLabel: string;
    deleteButtonLabel: string;
    cancelButtonLabel: string;
    deleteRequiresConfirmDialog: boolean;
    editRequiresConfirmDialog: boolean;
    confirmDeleteDialogData: ConfirmDialogData;
    confirmEditDialogData: ConfirmDialogData;

    constructor(
        title: (entity: EntityType) => string,
        confirmButtonLabel: string,
        deleteButtonLabel: string,
        cancelButtonLabel: string,
        deleteRequiresConfirmDialog: boolean,
        editRequiresConfirmDialog: boolean,
        confirmDeleteDialogData: ConfirmDialogData,
        confirmEditDialogData: ConfirmDialogData
    ) {
        this.title = title;
        this.confirmButtonLabel = confirmButtonLabel;
        this.deleteButtonLabel = deleteButtonLabel;
        this.cancelButtonLabel = cancelButtonLabel;
        this.deleteRequiresConfirmDialog = deleteRequiresConfirmDialog;
        this.editRequiresConfirmDialog = editRequiresConfirmDialog;
        this.confirmDeleteDialogData = confirmDeleteDialogData;
        this.confirmEditDialogData = confirmEditDialogData;
    }
}

export class EditDialogDataBuilder<EntityType extends Entity> {
    editDialogData: EditDialogDataInternal<EntityType>;
    private readonly dataInput?: EditDialogData<EntityType>;

    constructor(data?: EditDialogData<EntityType>) {
        // this.validateInput(data);
        this.dataInput = data;
        const confirmEditDialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(data?.confirmEditDialogData)
            .withDefaultConfirmButtonLabel('Save')
            .withDefaultText(['Do you really want to save all changes?'])
            .withDefaultTitle('Edit')
            .confirmDialogData;
        const confirmDeleteDialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(data?.confirmDeleteDialogData)
            .withDefaultConfirmButtonLabel('Delete')
            .withDefaultType('delete')
            .withDefaultText(['Do you really want to delete this entity?'])
            .withDefaultTitle('Delete')
            .confirmDialogData;
        this.editDialogData = new EditDialogDataInternal(
            data?.title ? data.title : () => 'Edit',
            data?.confirmButtonLabel ? data.confirmButtonLabel : 'Save',
            data?.deleteButtonLabel ? data.deleteButtonLabel : 'Delete',
            data?.cancelButtonLabel ? data.cancelButtonLabel : 'Cancel',
            data?.deleteRequiresConfirmDialog ? data.deleteRequiresConfirmDialog : true,
            data?.editRequiresConfirmDialog ? data.editRequiresConfirmDialog : false,
            confirmDeleteDialogData,
            confirmEditDialogData
        );
        return this;
    }

    withDefaultTitle(title: (entity: EntityType) => string): EditDialogDataBuilder<EntityType> {
        if (!this.dataInput?.title) {
            this.editDialogData.title = title;
        }
        return this;
    }

    withDefaultConfirmButtonLabel(label: string): EditDialogDataBuilder<EntityType> {
        if (!this.dataInput?.confirmButtonLabel) {
            this.editDialogData.confirmButtonLabel = label;
        }
        return this;
    }

    withDefaultDeleteButtonLabel(label: string): EditDialogDataBuilder<EntityType> {
        if (!this.dataInput?.deleteButtonLabel) {
            this.editDialogData.deleteButtonLabel = label;
        }
        return this;
    }

    withDefaultCancelButtonLabel(label: string): EditDialogDataBuilder<EntityType> {
        if (!this.dataInput?.cancelButtonLabel) {
            this.editDialogData.cancelButtonLabel = label;
        }
        return this;
    }

    withDefaultDeleteRequiresConfirmDialog(deleteRequiresConfirmDialog: boolean): EditDialogDataBuilder<EntityType> {
        if (!this.dataInput?.deleteRequiresConfirmDialog) {
            this.editDialogData.deleteRequiresConfirmDialog = deleteRequiresConfirmDialog;
        }
        return this;
    }

    withDefaultEditRequiresConfirmDialog(editRequiresConfirmDialog: boolean): EditDialogDataBuilder<EntityType> {
        if (!this.dataInput?.editRequiresConfirmDialog) {
            this.editDialogData.editRequiresConfirmDialog = editRequiresConfirmDialog;
        }
        return this;
    }

    withDefaultConfirmDeleteDialogData(confirmDeleteDialogData: ConfirmDialogData): EditDialogDataBuilder<EntityType> {
        if (!this.dataInput?.confirmDeleteDialogData) {
            this.editDialogData.confirmDeleteDialogData = confirmDeleteDialogData;
        }
        return this;
    }

    withDefaultConfirmEditDialogData(confirmEditDialogData: ConfirmDialogData): EditDialogDataBuilder<EntityType> {
        if (!this.dataInput?.confirmEditDialogData) {
            this.editDialogData.confirmEditDialogData = confirmEditDialogData;
        }
        return this;
    }
}