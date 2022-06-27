import { Entity } from '../classes/entity-model.class';
import { CreateDialogData } from '../components/entities/entities-data';
import { baseProperty } from './base/base-property.decorator';
import { DecoratorTypes } from './base/decorator-types.enum';
import { PropertyDecoratorConfig } from './base/property-decorator-config.interface';

/**
 * Decorator for setting and getting array propery metadata
 * @param metadata The metadata of the array property
 */
export function array<EntityType extends Entity>(
    metadata: EntityArrayDecoratorConfig<EntityType> | StringChipsArrayDecoratorConfig | AutocompleteStringChipsArrayDecoratorConfig
): (target: object, propertyKey: string) => void {
    switch (metadata.itemType) {
        case DecoratorTypes.OBJECT:
            return baseProperty(new EntityArrayDecoratorConfig(metadata), DecoratorTypes.ARRAY);
        case DecoratorTypes.STRING:
            return baseProperty(new StringChipsArrayDecoratorConfig(metadata), DecoratorTypes.ARRAY_STRING_CHIPS);
        case DecoratorTypes.STRING_AUTOCOMPLETE:
            return baseProperty(new AutocompleteStringChipsArrayDecoratorConfig(metadata), DecoratorTypes.ARRAY_STRING_AUTOCOMPLETE_CHIPS);
        default:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            throw new Error(`Unknown itemType ${(metadata as any).itemType}`);
    }
}

export interface ArrayTableDisplayColumn<EntityType extends Entity> {
    /**
     * The name inside the header.
     */
     displayName: string,
     /**
      * A method to get the value inside an row
      */
     value: (entity: EntityType) => string
}

/**
 * Interface definition for the @array metadata
 */
abstract class ArrayDecoratorConfig extends PropertyDecoratorConfig {
    /**
     * How to display the string
     */
    displayStyle!: 'table' | 'chips';

    /**
     * The type of the items inside the array
     */
    itemType!: DecoratorTypes;

    /**
     * The error-message to display when the array is required but contains no values
     */
    missingErrorMessage?: string;
}

/**
 * Definition for an array of Entities
 */
export class EntityArrayDecoratorConfig<EntityType extends Entity> extends ArrayDecoratorConfig {
    override itemType: DecoratorTypes.OBJECT;
    override displayStyle: 'table';

    /**
     * The EntityClass used for generating the create inputs
     */
    EntityClass!: new (entity?: EntityType) => EntityType;

    /**
     * The definition of the columns to display. Consists of the displayName to show in the header of the row
     * and the value, which is a function that generates the value to display inside a column
     */
    displayColumns: ArrayTableDisplayColumn<EntityType>[];

    /**
     * The data for the add-item-dialog.
     * Can be omitted when adding items inline.
     */
    createDialogData?: CreateDialogData

    /**
     * Whether or not the form for adding items to the array
     * should be displayed inline.
     * @default true
     */
    createInline?: boolean

    constructor(metadata: EntityArrayDecoratorConfig<EntityType>) {
        super(
            metadata.displayName,
            metadata.display,
            metadata.required,
            metadata.omitForCreate,
            metadata.omitForUpdate,
            metadata.defaultWidths,
            metadata.order
        );
        this.itemType = metadata.itemType;
        this.displayStyle = metadata.displayStyle;
        this.EntityClass = metadata.EntityClass;
        this.createDialogData = metadata.createDialogData;
        this.missingErrorMessage = metadata.missingErrorMessage;
        this.createInline = metadata.createInline;
        this.displayColumns = metadata.displayColumns
    }
}

/**
 * Definition for an array of strings displayed as a chips list
 */
export class StringChipsArrayDecoratorConfig extends ArrayDecoratorConfig {
    override itemType: DecoratorTypes.STRING;
    override displayStyle: 'chips';

    /**
     * The html inside the delete-button.
     * Please note that custom tags such as <mat-icon></mat-icon>
     * need to be defined as known elements, otherwise the sanitizer will remove them.
     * You can however work around this by using `<span class="material-icons"></span>`
     * @default <mat-icon>cancel</mat-icon>
     */
    deleteHtml?: string
    /**
     * (optional) The minimum required length of the string
     */
    minLength?: number;
    /**
     * (optional) The maximum required length of the string
     */
    maxLength?: number;
    /**
     * (optional) A regex used for validation
     */
    regex?: RegExp;

    constructor(metadata: StringChipsArrayDecoratorConfig) {
        super(
            metadata.displayName,
            metadata.display,
            metadata.required,
            metadata.omitForCreate,
            metadata.omitForUpdate,
            metadata.defaultWidths,
            metadata.order
        );
        this.itemType = metadata.itemType;
        this.displayStyle = metadata.displayStyle;
        this.deleteHtml =  metadata.deleteHtml;
        this.minLength = metadata.minLength;
        this.maxLength = metadata.maxLength;
        this.regex = metadata.regex;
    }
}

/**
 * Definition for an array of autocomplete strings displayed as a chips list
 */
export class AutocompleteStringChipsArrayDecoratorConfig extends ArrayDecoratorConfig {
    override itemType: DecoratorTypes.STRING_AUTOCOMPLETE;
    override displayStyle: 'chips';

    /**
     * The html inside the delete-button.
     * Please note that custom tags such as <mat-icon></mat-icon>
     * need to be defined as known elements, otherwise the sanitizer will remove them.
     * You can however work around this by using `<span class="material-icons"></span>`
     * @default <mat-icon>cancel</mat-icon>
     */
    deleteHtml?: string;
    /**
     * The autocomplete values
     */
    autocompleteValues: string[];
    /**
     * (optional) The minimum required length of the string
     */
    minLength?: number;
    /**
     * (optional) The maximum required length of the string
     */
    maxLength?: number;
    /**
     * (optional) A regex used for validation
     */
    regex?: RegExp;

    constructor(metadata: AutocompleteStringChipsArrayDecoratorConfig) {
        super(
            metadata.displayName,
            metadata.display,
            metadata.required,
            metadata.omitForCreate,
            metadata.omitForUpdate,
            metadata.defaultWidths,
            metadata.order
        );
        this.itemType = metadata.itemType;
        this.displayStyle = metadata.displayStyle;
        this.deleteHtml =  metadata.deleteHtml;
        this.autocompleteValues = metadata.autocompleteValues;
        this.minLength = metadata.minLength;
        this.maxLength = metadata.maxLength;
        this.regex = metadata.regex;
    }
}