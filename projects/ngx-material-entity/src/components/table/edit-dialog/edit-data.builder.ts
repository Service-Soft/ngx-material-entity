import { BaseBuilder } from '../../../classes/base.builder';
import { BaseEntityType } from '../../../classes/entity.model';
import { defaultFalse } from '../../../functions/default-false.function';
import { defaultTrue } from '../../../functions/default-true.function';
import { isAsyncFunction } from '../../../functions/is-async-function.function';
import { ConfirmDialogData } from '../../confirm-dialog/confirm-dialog-data';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../../confirm-dialog/confirm-dialog-data.builder';
import { EditAction, EditData } from '../table-data';

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

    constructor(data: EditAction<EntityType>) {
        this.displayName = data.displayName;
        this.action = this.functionToAsync(data.action);
        this.enabled = data.enabled ?? defaultTrue;
        this.requireConfirmDialog = data.requireConfirmDialog ?? defaultFalse;
        this.confirmDialogData = new ConfirmDialogDataBuilder(data.confirmDialogData)
            .withDefault('text', ['Do you really want to run this action?'])
            .getResult();
    }

    // eslint-disable-next-line max-len
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
        actions: EditAction<EntityType>[]
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
        this.actions = actions.map(a => new EditActionInternal(a));
    }
}

/**
 * The Builder for the EditDialogData. Sets default values.
 */
export class EditDialogDataBuilder<EntityType extends BaseEntityType<EntityType>>
    extends BaseBuilder<EditDataInternal<EntityType>, EditData<EntityType>> {

    constructor(data?: EditData<EntityType>) {
        super(data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data?: EditData<EntityType>): EditDataInternal<EntityType> {
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

        return new EditDataInternal(
            data?.title ?? (() => 'Edit'),
            data?.confirmButtonLabel ?? 'Save',
            data?.deleteButtonLabel ?? 'Delete',
            data?.cancelButtonLabel ?? 'Cancel',
            data?.deleteRequiresConfirmDialog ?? true,
            data?.editRequiresConfirmDialog ?? false,
            confirmDeleteDialogData,
            confirmEditDialogData,
            data?.actionsLabel ?? 'Actions',
            data?.actions ?? []
        );
    }
}