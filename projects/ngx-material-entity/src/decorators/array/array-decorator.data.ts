import { Entity } from '../../classes/entity-model.class';
import { CreateDialogData } from '../../components/table/table-data';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { PropertyDecoratorConfig } from '../base/property-decorator.data';

/**
 * The configuration options for an array property displayed as a table.
 */
export interface ArrayTableDisplayColumn<EntityType extends Entity> {
    /**
     * The name inside the header.
     */
    displayName: string,
    /**
     * A method to get the value inside an row.
     */
    value: (entity: EntityType) => string
}

/**
 * Interface definition for the @array metadata.
 */
abstract class ArrayDecoratorConfig extends PropertyDecoratorConfig {
    /**
     * How to display the string.
     */
    displayStyle!: 'table' | 'chips';

    /**
     * The type of the items inside the array.
     */
    itemType!: DecoratorTypes;
}

/**
 * Definition for an array of Entities.
 */
export interface EntityArrayDecoratorConfig<EntityType extends Entity> extends ArrayDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.OBJECT,
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'table',

    /**
     * The EntityClass used for generating the create inputs.
     */
    EntityClass: new (entity?: EntityType) => EntityType,

    /**
     * The definition of the columns to display. Consists of the displayName to show in the header of the row
     * and the value, which is a function that generates the value to display inside a column.
     */
    displayColumns: ArrayTableDisplayColumn<EntityType>[],

    /**
     * The data for the add-item-dialog.
     * Can be omitted when adding items inline.
     */
    createDialogData?: CreateDialogData,

    /**
     * Whether or not the form for adding items to the array
     * should be displayed inline.
     *
     * @default true
     */
    createInline?: boolean,

    /**
     * The error-message to display when the array is required but contains no values.
     */
    missingErrorMessage?: string
}

/**
 * Definition for an array of strings displayed as a chips list.
 */
export interface StringChipsArrayDecoratorConfig extends ArrayDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.STRING,
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'chips',

    /**
     * The class for the <i> tag used to remove an entry from the array.
     *
     * @default 'fas fa-circle-minus'
     */
    deleteIcon?: string,
    /**
     * The minimum required length of the string.
     */
    minLength?: number,
    /**
     * The maximum required length of the string.
     */
    maxLength?: number,
    /**
     * A regex used for validation.
     */
    regex?: RegExp
}

/**
 * Definition for an array of autocomplete strings displayed as a chips list.
 */
export interface AutocompleteStringChipsArrayDecoratorConfig extends ArrayDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.STRING_AUTOCOMPLETE,
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'chips',

    /**
     * The class for the <i> tag used to remove an entry from the array.
     *
     * @default 'fas fa-circle-minus'
     */
    deleteIcon?: string,
    /**
     * The autocomplete values.
     */
    autocompleteValues: string[],
    /**
     * The minimum required length of the string.
     */
    minLength?: number,
    /**
     * The maximum required length of the string.
     */
    maxLength?: number,
    /**
     * A regex used for validation.
     */
    regex?: RegExp
}