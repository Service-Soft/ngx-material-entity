import { CreateDialogData } from '../../components/table/table-data';
import { EntityClassNewable } from '../../classes/entity.model';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { ArrayTableDisplayColumn, AutocompleteStringChipsArrayDecoratorConfig, EntityArrayDecoratorConfig, StringChipsArrayDecoratorConfig } from './array-decorator.data';

/**
 * The internal EntityArrayDecoratorConfig. Sets default values.
 */
export class EntityArrayDecoratorConfigInternal<EntityType extends object>
    extends PropertyDecoratorConfigInternal implements EntityArrayDecoratorConfig<EntityType> {

    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.OBJECT;
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'table';
    // eslint-disable-next-line jsdoc/require-jsdoc
    EntityClass: EntityClassNewable<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayColumns: ArrayTableDisplayColumn<EntityType>[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    createDialogData?: CreateDialogData;
    // eslint-disable-next-line jsdoc/require-jsdoc
    createInline: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    missingErrorMessage: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    addButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    removeButtonLabel: string;

    constructor(data: EntityArrayDecoratorConfig<EntityType>) {
        super(data);
        this.createInline = data.createInline != undefined ? data.createInline : true;
        this.displayStyle = data.displayStyle;
        this.itemType = data.itemType;
        this.EntityClass = data.EntityClass;
        this.displayColumns = data.displayColumns;
        this.createInline = data.createInline != undefined ? data.createInline : true;
        this.missingErrorMessage = data.missingErrorMessage ? data.missingErrorMessage : 'Needs to contain at least one value';
        this.defaultWidths = data.defaultWidths ? data.defaultWidths : [12, 12, 12];
        this.addButtonLabel = data.addButtonLabel ? data.addButtonLabel: 'Add'
        this.removeButtonLabel = data.removeButtonLabel ? data.removeButtonLabel: 'Remove'
    }
}

/**
 * The internal StringChipsArrayDecoratorConfig. Sets default values.
 */
export class StringChipsArrayDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements StringChipsArrayDecoratorConfig {
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.STRING;
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'chips';
    // eslint-disable-next-line jsdoc/require-jsdoc
    deleteIcon: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    minLength?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxLength?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    regex?: RegExp;

    constructor(data: StringChipsArrayDecoratorConfig) {
        super(data);
        this.deleteIcon = data.deleteIcon ? data.deleteIcon : 'fas fa-circle-minus';
        this.displayStyle = data.displayStyle;
        this.itemType = data.itemType;
        this.maxLength = data.maxLength;
        this.minLength = data.minLength;
        this.regex = data.regex;
        this.defaultWidths = data.defaultWidths ? data.defaultWidths : [6, 12, 12];
    }
}

/**
 * The internal AutocompleteStringChipsArrayDecoratorConfig. Sets default values.
 */
export class AutocompleteStringChipsArrayDecoratorConfigInternal
    extends PropertyDecoratorConfigInternal implements AutocompleteStringChipsArrayDecoratorConfig {

    // eslint-disable-next-line jsdoc/require-jsdoc
    autocompleteValues: string[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    itemType: DecoratorTypes.STRING_AUTOCOMPLETE;
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'chips';
    // eslint-disable-next-line jsdoc/require-jsdoc
    deleteIcon: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    minLength?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    maxLength?: number;
    // eslint-disable-next-line jsdoc/require-jsdoc
    regex?: RegExp;

    constructor(data: AutocompleteStringChipsArrayDecoratorConfig) {
        super(data);
        this.autocompleteValues = data.autocompleteValues;
        this.deleteIcon = data.deleteIcon ? data.deleteIcon : 'fas fa-circle-minus'
        this.displayStyle = data.displayStyle;
        this.itemType = data.itemType;
        this.maxLength = data.maxLength;
        this.minLength = data.minLength;
        this.regex = data.regex;
        this.defaultWidths = data.defaultWidths ? data.defaultWidths : [6, 12, 12];
    }
}