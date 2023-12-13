import { BaseBuilder } from '../../classes/base.builder';
import { BaseEntityType } from '../../classes/entity.model';
import { NgxGlobalDefaultValues } from '../../global-configuration-values';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from '../confirm-dialog/confirm-dialog-data.builder';
import { CreateDataBuilder, CreateDataInternal } from '../table/create-dialog/create-data.builder';
import { CreateEntityDataInternal } from '../table/create-dialog/create-entity-dialog-data.builder';
import { PageCreateData } from './create-page.component';

// eslint-disable-next-line jsdoc/require-jsdoc
export type PageCreateDataInternal<EntityType extends BaseEntityType<EntityType>> = Omit<CreateEntityDataInternal<EntityType>, 'entity' | 'EntityServiceClass'> & {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayLoadingSpinner: boolean,
    // eslint-disable-next-line jsdoc/require-jsdoc
    createData: CreateDataInternal & {
        // eslint-disable-next-line jsdoc/require-jsdoc
        confirmUnsavedChangesDialogData: ConfirmDialogDataInternal,
        // eslint-disable-next-line jsdoc/require-jsdoc
        unsavedChangesRequireConfirmDialog: boolean
    }
};

// eslint-disable-next-line jsdoc/require-jsdoc
export class PageCreateDataBuilder<EntityType extends BaseEntityType<EntityType>>
    extends BaseBuilder<PageCreateDataInternal<EntityType>, PageCreateData<EntityType>> {

    constructor(data: PageCreateData<EntityType>, globalConfig: NgxGlobalDefaultValues) {
        super(globalConfig, data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data: PageCreateData<EntityType>): PageCreateDataInternal<EntityType> {
        const createData: CreateDataInternal = new CreateDataBuilder(this.globalConfig, data.createData)
            .withDefault('cancelButtonLabel', this.globalConfig.backLabel)
            .getResult();

        const confirmUnsavedChangesDialogData: ConfirmDialogDataInternal = new ConfirmDialogDataBuilder(this.globalConfig, data.createData?.confirmUnsavedChangesDialogData)
            .withDefault('title', this.globalConfig.confirmUnsavedChangesTitle)
            .withDefault('text', this.globalConfig.confirmUnsavedChangesText)
            .withDefault('confirmButtonLabel', this.globalConfig.confirmUnsavedChangesLabel)
            .getResult();

        return {
            createData: {
                ...createData,
                confirmUnsavedChangesDialogData: confirmUnsavedChangesDialogData,
                unsavedChangesRequireConfirmDialog: data.createData?.unsavedChangesRequireConfirmDialog ?? true
            },
            displayLoadingSpinner: data.displayLoadingSpinner ?? true
        };
    }
}