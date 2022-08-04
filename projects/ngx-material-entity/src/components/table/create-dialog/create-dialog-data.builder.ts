import { BaseBuilder } from '../../../classes/base.builder';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../../confirm-dialog/confirm-dialog-data.builder';
import { CreateDialogData } from '../table-data';

/**
 * The internal CreateDialogData. Requires all default values the user can leave out.
 */
export class CreateDialogDataInternal implements CreateDialogData {
    // eslint-disable-next-line jsdoc/require-jsdoc
    title: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    createButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    cancelButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    createRequiresConfirmDialog: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
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

/**
 * The Builder for the CreateDialogData. Sets default values.
 */
export class CreateDialogDataBuilder extends BaseBuilder<CreateDialogDataInternal, CreateDialogData> {

    constructor(data?: CreateDialogData) {
        super(data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data?: CreateDialogData): CreateDialogDataInternal {
        const confirmCreateDialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(data?.confirmCreateDialogData)
            .withDefault('confirmButtonLabel', 'create')
            .withDefault('text', ['Do you really want to create this entity?'])
            .withDefault('title', 'Create')
            .getResult();
        return new CreateDialogDataInternal(
            data?.title ? data.title : 'Create',
            data?.createButtonLabel ? data.createButtonLabel : 'Create',
            data?.cancelButtonLabel ? data.cancelButtonLabel : 'Cancel',
            data?.createRequiresConfirmDialog ? data.createRequiresConfirmDialog : false,
            confirmCreateDialogData
        );
    }
}