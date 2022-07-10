import { NgModel } from '@angular/forms';
import { Entity } from '../../../../classes/entity-model.class';
import { CreateDialogData } from '../../../table/table-data';

export interface AddArrayItemDialogData<EntityType extends Entity> {
    /**
     * An empty entity that is used as the data model.
     */
    entity: EntityType,
    /**
     * The info of the generic create-dialog.
     */
    createDialogData?: CreateDialogData,
    /**
     * A custom function to generate the error-message for invalid inputs.
     */
    getValidationErrorMessage?: (model: NgModel) => string
}