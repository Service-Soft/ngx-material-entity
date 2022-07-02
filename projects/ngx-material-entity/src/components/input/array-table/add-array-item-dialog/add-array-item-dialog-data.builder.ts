import { NgModel } from '@angular/forms';
import { Entity } from '../../../../classes/entity-model.class';
import { getValidationErrorMessage } from '../../../get-validation-error-message.function';
import { CreateDialogDataBuilder, CreateDialogDataInternal } from '../../../table/create-dialog/create-dialog-data.builder';
import { AddArrayItemDialogData } from './add-array-item-dialog-data';

export class AddArrayItemDialogDataInternal<EntityType extends Entity> implements AddArrayItemDialogData<EntityType> {
    entity: EntityType;
    createDialogData: CreateDialogDataInternal;
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

export class AddArrayItemDialogDataBuilder<EntityType extends Entity> {
    addArrayItemDialogData: AddArrayItemDialogDataInternal<EntityType>;
    private readonly dataInput: AddArrayItemDialogData<EntityType>;

    constructor(data: AddArrayItemDialogData<EntityType>) {
        this.dataInput = data;
        const createDialogData = new CreateDialogDataBuilder(data.createDialogData)
            .withDefaultCreateButtonLabel('Add')
            .withDefaultTitle('Add to array')
            .createDialogData;
        this.addArrayItemDialogData = new AddArrayItemDialogDataInternal(
            data.entity,
            createDialogData,
            data.getValidationErrorMessage ? data.getValidationErrorMessage : getValidationErrorMessage,
        );
        return this;
    }

    withDefaultCreateDialogData(createDialogData: CreateDialogDataInternal): AddArrayItemDialogDataBuilder<EntityType> {
        if (!this.dataInput.createDialogData) {
            this.addArrayItemDialogData.createDialogData = createDialogData;
        }
        return this;
    }

    withDefaultGetValidationErrorMessage(getValidationErrorMessage: (model: NgModel) => string): AddArrayItemDialogDataBuilder<EntityType> {
        if (!this.dataInput.getValidationErrorMessage) {
            this.addArrayItemDialogData.getValidationErrorMessage = getValidationErrorMessage;
        }
        return this;
    }
}