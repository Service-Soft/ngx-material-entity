import { NgModel } from '@angular/forms';
import { BaseEntityType } from '../../classes/entity.model';
import { CreateDialogData } from '../table/table-data';

/**
 * The configuration options for the dialog that adds items to an array.
 */
export interface AddArrayItemDialogData<EntityType extends BaseEntityType<EntityType>> {
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