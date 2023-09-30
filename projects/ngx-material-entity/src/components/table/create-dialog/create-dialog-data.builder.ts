import { BaseBuilder } from '../../../classes/base.builder';
import { getConfigValue } from '../../../functions/get-config-value.function';
import { NgxGlobalDefaultValues } from '../../../global-configuration-values';
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

    constructor(globalConfig: NgxGlobalDefaultValues, data?: CreateDialogData) {
        super(globalConfig, data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data?: CreateDialogData): CreateDialogDataInternal {
        // eslint-disable-next-line max-len
        const confirmCreateDialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.globalConfig, data?.confirmCreateDialogData)
            .withDefault('confirmButtonLabel', this.globalConfig.createLabel)
            .withDefault('text', this.globalConfig.confirmCreateText)
            .withDefault('title', this.globalConfig.createLabel)
            .getResult();
        return new CreateDialogDataInternal(
            getConfigValue(this.globalConfig.createLabel, data?.title),
            getConfigValue(this.globalConfig.createLabel, data?.createButtonLabel),
            getConfigValue(this.globalConfig.cancelLabel, data?.cancelButtonLabel),
            data?.createRequiresConfirmDialog ?? false,
            confirmCreateDialogData
        );
    }
}