import { BaseEntityType } from '../../classes/entity.model';
import { DisplayColumn, DynamicStyleClasses } from '../../components/table/table-data';
import { DropdownValue } from '../base/dropdown-value.interface';
import { PropertyDecoratorConfig } from '../base/property-decorator.data';

/**
 * Definition for the @referencesMany metadata.
 */
export interface ReferencesManyDecoratorConfig<EntityType extends BaseEntityType<EntityType>> extends PropertyDecoratorConfig<EntityType> {
    /**
     * The function that returns the values that can be referenced.
     */
    getReferencedEntities: () => Promise<EntityType[]>,

    /**
     * Method to get the referenced dropdown values.
     */
    getDropdownValues: (referencedEntities: EntityType[]) => DropdownValue<string>[],

    /**
     * Gets the referenced entity for the given id.
     */
    getEntityForId?: (entityId: string, allReferencedEntities: EntityType[]) => EntityType,

    /**
     * The error message to display when an array property is required and empty.
     * @default 'Needs to contain at least one value'
     */
    emptyErrorMessage?: string,

    /**
     * Configuration for css classes that should be applied to table rows based on a condition.
     * This could be used to eg. Set the background color to green when an item has the status completed etc.
     * INFO: You need to use ng-deep or apply the styling in the styles.scss.
     * @default () => []
     */
    dynamicRowStyleClasses?: DynamicStyleClasses<EntityType>,

    /**
     * The definition of the columns to display. Consists of the displayName to show in the header of the row
     * and the value, which is a function that generates the value to display inside a column.
     */
    displayColumns: DisplayColumn<EntityType>[],

    /**
     * The label for the dropdown input.
     * @default 'Select'
     */
    dropdownLabel?: string,

    /**
     * Whether or not a button that adds all values exists.
     * @default false
     */
    addAll?: boolean,

    /**
     * The label for the add all button.
     * @default 'Add all'
     */
    addAllButtonLabel?: string,

    /**
     * The label for the add button when createInline is true.
     * @default 'Add'
     */
    addButtonLabel?: string,

    /**
     * The label for the remove button when createInline is true.
     * @default 'Remove'
     */
    removeButtonLabel?: string
}