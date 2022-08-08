import { BaseBuilder } from '../../../classes/base.builder';
import { ConfirmDialogData } from '../../confirm-dialog/confirm-dialog-data';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../../confirm-dialog/confirm-dialog-data.builder';
import { EditDialogData } from '../table-data';

/**
 * The internal EditDialogData. Requires all default values the user can leave out.
 */
export class EditDialogDataInternal<EntityType extends object> implements EditDialogData<EntityType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    title: (entity: EntityType) => string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    confirmButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    deleteButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    cancelButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    deleteRequiresConfirmDialog: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    editRequiresConfirmDialog: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    confirmDeleteDialogData: ConfirmDialogData;
    // eslint-disable-next-line jsdoc/require-jsdoc
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

/**
 * The Builder for the EditDialogData. Sets default values.
 */
export class EditDialogDataBuilder<EntityType extends object>
    extends BaseBuilder<EditDialogDataInternal<EntityType>, EditDialogData<EntityType>> {

    constructor(data?: EditDialogData<EntityType>) {
        super(data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data?: EditDialogData<EntityType>): EditDialogDataInternal<EntityType> {
        const confirmEditDialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(data?.confirmEditDialogData)
            .withDefault('confirmButtonLabel', 'Save')
            .withDefault('text', ['Do you really want to save all changes?'])
            .withDefault('title', 'Edit')
            .getResult();

        const confirmDeleteDialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(data?.confirmDeleteDialogData)
            .withDefault('confirmButtonLabel', 'Delete')
            .withDefault('type', 'delete')
            .withDefault('text', ['Do you really want to delete this entity?'])
            .withDefault('title', 'Delete')
            .getResult();

        return new EditDialogDataInternal(
            data?.title ?? (() => 'Edit'),
            data?.confirmButtonLabel ?? 'Save',
            data?.deleteButtonLabel ?? 'Delete',
            data?.cancelButtonLabel ?? 'Cancel',
            data?.deleteRequiresConfirmDialog ?? true,
            data?.editRequiresConfirmDialog ?? false,
            confirmDeleteDialogData,
            confirmEditDialogData
        );
    }
}