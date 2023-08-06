import { BaseBuilder } from '../../classes/base.builder';
import { BaseEntityType } from '../../classes/entity.model';
import { defaultTrue } from '../../functions/default-true.function';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../confirm-dialog/confirm-dialog-data.builder';
import { EditDataInternal, EditDialogDataBuilder } from '../table/edit-dialog/edit-data.builder';
import { EditEntityDataInternal } from '../table/edit-dialog/edit-entity.builder';
import { PageEditData } from './edit-page.component';

// eslint-disable-next-line jsdoc/require-jsdoc, max-len
export type PageEditDataInternal<EntityType extends BaseEntityType<EntityType>> = Omit<EditEntityDataInternal<EntityType>, 'entity' | 'EntityServiceClass'> & {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayLoadingSpinner: boolean,
    // eslint-disable-next-line jsdoc/require-jsdoc
    editData: EditDataInternal<EntityType> & {
        // eslint-disable-next-line jsdoc/require-jsdoc
        confirmUnsavedChangesDialogData: ConfirmDialogDataInternal,
        // eslint-disable-next-line jsdoc/require-jsdoc
        unsavedChangesRequireConfirmDialog: boolean
    }
};

// eslint-disable-next-line jsdoc/require-jsdoc
export class PageEditDataBuilder<EntityType extends BaseEntityType<EntityType>>
    extends BaseBuilder<PageEditDataInternal<EntityType>, PageEditData<EntityType>> {

    constructor(data: PageEditData<EntityType>) {
        super(data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data: PageEditData<EntityType>): PageEditDataInternal<EntityType> {
        const editData: EditDataInternal<EntityType> = new EditDialogDataBuilder(data.editData)
            .withDefault('cancelButtonLabel', 'Back')
            .getResult();
        // eslint-disable-next-line max-len
        const confirmUnsavedChangesDialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(data.editData?.confirmUnsavedChangesDialogData)
            .withDefault('title', 'Unsaved Changes')
            .withDefault('text', ['You have unsaved changes that will be deleted when you leave this page.', 'Continue?'])
            .withDefault('confirmButtonLabel', 'Leave')
            .getResult();

        return {
            editData: {
                ...editData,
                confirmUnsavedChangesDialogData: confirmUnsavedChangesDialogData,
                unsavedChangesRequireConfirmDialog: data.editData?.unsavedChangesRequireConfirmDialog ?? true
            },
            allowUpdate: data.allowUpdate ?? defaultTrue,
            allowDelete: data.allowDelete ?? defaultTrue,
            displayLoadingSpinner: data.displayLoadingSpinner ?? true
        };
    }
}