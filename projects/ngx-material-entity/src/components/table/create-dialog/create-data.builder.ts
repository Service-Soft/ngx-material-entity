import { BaseBuilder } from '../../../classes/base.builder';
import { getConfigValue } from '../../../functions/get-config-value.function';
import { NgxGlobalDefaultValues } from '../../../global-configuration-values';
import { ConfirmDialogData } from '../../confirm-dialog/confirm-dialog-data';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../../confirm-dialog/confirm-dialog-data.builder';
import { CreateData } from '../table-data';

/**
 * The internal CreateData. Requires all default values the user can leave out.
 */
export class CreateDataInternal implements CreateData {
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
    // eslint-disable-next-line jsdoc/require-jsdoc
    unsavedChangesRequireConfirmDialog: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    confirmUnsavedChangesDialogData: ConfirmDialogData;

    constructor(
        title: string,
        createButtonLabel: string,
        cancelButtonLabel: string,
        createRequiresConfirmDialog: boolean,
        confirmCreateDialogData: ConfirmDialogDataInternal,
        unsavedChangesRequireConfirmDialog: boolean,
        confirmUnsavedChangesDialogData: ConfirmDialogDataInternal
    ) {
        this.title = title;
        this.createButtonLabel = createButtonLabel;
        this.cancelButtonLabel = cancelButtonLabel;
        this.createRequiresConfirmDialog = createRequiresConfirmDialog;
        this.confirmCreateDialogData = confirmCreateDialogData;
        this.unsavedChangesRequireConfirmDialog = unsavedChangesRequireConfirmDialog;
        this.confirmUnsavedChangesDialogData = confirmUnsavedChangesDialogData;
    }
}

/**
 * The Builder for the CreateData. Sets default values.
 */
export class CreateDataBuilder extends BaseBuilder<CreateDataInternal, CreateData> {

    constructor(globalConfig: NgxGlobalDefaultValues, data?: CreateData) {
        super(globalConfig, data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data?: CreateData): CreateDataInternal {
        // eslint-disable-next-line stylistic/max-len
        const confirmCreateDialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.globalConfig, data?.confirmCreateDialogData)
            .withDefault('confirmButtonLabel', this.globalConfig.createLabel)
            .withDefault('text', this.globalConfig.confirmCreateText)
            .withDefault('title', this.globalConfig.createLabel)
            .getResult();
        // eslint-disable-next-line stylistic/max-len
        const confirmUnsavedChangesDialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.globalConfig, data?.confirmUnsavedChangesDialogData)
            .withDefault('confirmButtonLabel', this.globalConfig.confirmUnsavedChangesDialogLabel)
            .withDefault('text', this.globalConfig.confirmUnsavedChangesDialogText)
            .withDefault('title', this.globalConfig.confirmUnsavedChangesTitle)
            .getResult();
        return new CreateDataInternal(
            getConfigValue(this.globalConfig.createLabel, data?.title),
            getConfigValue(this.globalConfig.createLabel, data?.createButtonLabel),
            getConfigValue(this.globalConfig.cancelLabel, data?.cancelButtonLabel),
            data?.createRequiresConfirmDialog ?? false,
            confirmCreateDialogData,
            data?.unsavedChangesRequireConfirmDialog ?? true,
            confirmUnsavedChangesDialogData
        );
    }
}