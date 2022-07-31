import { NgModel } from '@angular/forms';
import { BaseBuilder } from '../../classes/base-builder.class';
import { getValidationErrorMessage } from '../get-validation-error-message.function';
import { CreateDialogDataBuilder, CreateDialogDataInternal } from '../table/create-dialog/create-dialog-data.builder';
import { AddArrayItemDialogData } from './add-array-item-dialog-data';

/**
 * The internal AddArrayItemDialogData. Requires all default values the user can leave out.
 */
export class AddArrayItemDialogDataInternal<EntityType extends object> implements AddArrayItemDialogData<EntityType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    entity: EntityType;
    // eslint-disable-next-line jsdoc/require-jsdoc
    createDialogData: CreateDialogDataInternal;
    // eslint-disable-next-line jsdoc/require-jsdoc
    getValidationErrorMessage: (model: NgModel) => string;

    constructor(
        entity: EntityType,
        createDialogData: CreateDialogDataInternal,
        getValidationErrorMessage: (model: NgModel) => string
    ) {
        this.entity = entity;
        this.createDialogData = createDialogData;
        this.getValidationErrorMessage = getValidationErrorMessage;
    }
}

/**
 * The Builder for the AddArrayItemDialogData. Sets default values.
 */
export class AddArrayItemDialogDataBuilder<EntityType extends object>
    extends BaseBuilder<AddArrayItemDialogDataInternal<EntityType>, AddArrayItemDialogData<EntityType>> {

    constructor(data: AddArrayItemDialogData<EntityType>) {
        super(data);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected generateBaseData(data: AddArrayItemDialogData<EntityType>): AddArrayItemDialogDataInternal<EntityType> {
        const createDialogData = new CreateDialogDataBuilder(data.createDialogData)
            .withDefault('createButtonLabel', 'Add')
            .withDefault('title', 'Add to array')
            .getResult();
        return new AddArrayItemDialogDataInternal(
            data.entity,
            createDialogData,
            data.getValidationErrorMessage ? data.getValidationErrorMessage : getValidationErrorMessage,
        );
    }
}