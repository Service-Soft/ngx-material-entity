import { Inject } from '@angular/core';
import { BaseBuilder } from '../../../classes/base.builder';
import { BaseEntityType } from '../../../classes/entity.model';
import { NGX_INTERNAL_GLOBAL_DEFAULT_VALUES } from '../../../default-global-configuration-values';
import { defaultFalse } from '../../../functions/default-false.function';
import { defaultTrue } from '../../../functions/default-true.function';
import { getConfigValue } from '../../../functions/get-config-value.function';
import { isAsyncFunction } from '../../../functions/is-async-function.function';
import { ConfirmDialogData } from '../../confirm-dialog/confirm-dialog-data';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../../confirm-dialog/confirm-dialog-data.builder';
import { EditAction, EditData } from '../table-data';
import { NgxGlobalDefaultValues } from '../../../global-configuration-values';

/**
 * The internal edit action.
 * Sets default values.
 */
export class EditActionInternal<EntityType extends BaseEntityType<EntityType>> implements EditAction<EntityType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayName: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    action: (entity: EntityType, entityPriorChanges: EntityType) => Promise<unknown>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    enabled: ((e: EntityType) => boolean);
    // eslint-disable-next-line jsdoc/require-jsdoc
    requireConfirmDialog: ((e: EntityType) => boolean);
    // eslint-disable-next-line jsdoc/require-jsdoc
    confirmDialogData: ConfirmDialogData;

    constructor(
        data: EditAction<EntityType>,
        @Inject(NGX_INTERNAL_GLOBAL_DEFAULT_VALUES)
        protected readonly globalConfig: NgxGlobalDefaultValues
    ) {
        this.displayName = data.displayName;
        this.action = this.functionToAsync(data.action);
        this.enabled = data.enabled ?? defaultTrue;
        this.requireConfirmDialog = data.requireConfirmDialog ?? defaultFalse;
        this.confirmDialogData = new ConfirmDialogDataBuilder(this.globalConfig, data.confirmDialogData)
            .withDefault('text', globalConfig.confirmBaseActionText)
            .getResult();
    }


    private functionToAsync(originalFunction: ((e: EntityType, ePriorChanges: EntityType) => unknown) | ((e: EntityType, ePriorChanges: EntityType) => Promise<unknown>)): (e: EntityType, ePriorChanges: EntityType) => Promise<unknown> {
        if (isAsyncFunction(originalFunction)) {
            return originalFunction as (e: EntityType) => Promise<unknown>;
        }

        /* istanbul ignore next */
        return (e: EntityType, ePriorChanges: EntityType) => new Promise<unknown>((resolve, reject) => {
            try {
                resolve(originalFunction(e, ePriorChanges));
            }
            catch (error) {
                reject(error);
            }
        });
    }
}

/**
 * The internal EditData. Requires all default values the user can leave out.
 */
export class EditDataInternal<EntityType extends BaseEntityType<EntityType>> implements EditData<EntityType> {
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
    // eslint-disable-next-line jsdoc/require-jsdoc
    actionsLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    actions: EditActionInternal<EntityType>[];

    constructor(
        title: (entity: EntityType) => string,
        confirmButtonLabel: string,
        deleteButtonLabel: string,
        cancelButtonLabel: string,
        deleteRequiresConfirmDialog: boolean,
        editRequiresConfirmDialog: boolean,
        confirmDeleteDialogData: ConfirmDialogData,
        confirmEditDialogData: ConfirmDialogData,
        actionsLabel: string,
        actions: EditAction<EntityType>[],
        @Inject(NGX_INTERNAL_GLOBAL_DEFAULT_VALUES)
        globalConfig: NgxGlobalDefaultValues
    ) {
        this.title = title;
        this.confirmButtonLabel = confirmButtonLabel;
        this.deleteButtonLabel = deleteButtonLabel;
        this.cancelButtonLabel = cancelButtonLabel;
        this.deleteRequiresConfirmDialog = deleteRequiresConfirmDialog;
        this.editRequiresConfirmDialog = editRequiresConfirmDialog;
        this.confirmDeleteDialogData = confirmDeleteDialogData;
        this.confirmEditDialogData = confirmEditDialogData;
        this.actionsLabel = actionsLabel;
        this.actions = actions.map(a => new EditActionInternal(a, globalConfig));
    }
}

/**
 * The Builder for the EditData. Sets default values.
 */
export class EditDataBuilder<EntityType extends BaseEntityType<EntityType>>
    extends BaseBuilder<EditDataInternal<EntityType>, EditData<EntityType>> {

    constructor(globalConfig: NgxGlobalDefaultValues, data?: EditData<EntityType>) {
        super(globalConfig, data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data?: EditData<EntityType>): EditDataInternal<EntityType> {
        const confirmEditDialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(
            this.globalConfig,
            data?.confirmEditDialogData
        )
            .withDefault('confirmButtonLabel', this.globalConfig.saveLabel)
            .withDefault('text', this.globalConfig.confirmSaveText)
            .withDefault('title', this.globalConfig.editLabel)
            .getResult();

        const confirmDeleteDialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(
            this.globalConfig,
            data?.confirmDeleteDialogData
        )
            .withDefault('confirmButtonLabel', this.globalConfig.deleteLabel)
            .withDefault('type', 'delete')
            .withDefault('text', this.globalConfig.confirmDeleteText)
            .withDefault('title', this.globalConfig.deleteLabel)
            .getResult();

        return new EditDataInternal(
            getConfigValue(this.globalConfig.editTitle, data?.title),
            getConfigValue(this.globalConfig.saveLabel, data?.confirmButtonLabel),
            getConfigValue(this.globalConfig.deleteLabel, data?.deleteButtonLabel),
            getConfigValue(this.globalConfig.cancelLabel, data?.cancelButtonLabel),
            data?.deleteRequiresConfirmDialog ?? true,
            data?.editRequiresConfirmDialog ?? false,
            confirmDeleteDialogData,
            confirmEditDialogData,
            getConfigValue(this.globalConfig.actionsLabel, data?.actionsLabel),
            data?.actions ?? [],
            this.globalConfig
        );
    }
}