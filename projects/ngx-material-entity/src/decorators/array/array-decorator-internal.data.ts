import { Entity } from '../../classes/entity-model.class';
import { CreateDialogData } from '../../components/table/table-data';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { ArrayTableDisplayColumn, AutocompleteStringChipsArrayDecoratorConfig, EntityArrayDecoratorConfig, StringChipsArrayDecoratorConfig } from './array-decorator.data';

export class EntityArrayDecoratorConfigInternal<EntityType extends Entity>
    extends PropertyDecoratorConfigInternal implements EntityArrayDecoratorConfig<EntityType> {

    itemType: DecoratorTypes.OBJECT;
    displayStyle: 'table';
    EntityClass: new (entity?: EntityType) => EntityType;
    displayColumns: ArrayTableDisplayColumn<EntityType>[];
    createDialogData?: CreateDialogData;
    createInline: boolean;
    missingErrorMessage: string;

    constructor(data: EntityArrayDecoratorConfig<EntityType>) {
        super(data);
        this.createDialogData = data.createDialogData;
        this.displayStyle = data.displayStyle;
        this.itemType = data.itemType;
        this.EntityClass = data.EntityClass;
        this.displayColumns = data.displayColumns;
        this.createInline = data.createInline != undefined ? data.createInline : true;
        this.missingErrorMessage = data.missingErrorMessage ? data.missingErrorMessage : 'Needs to contain at least one value';
        this.defaultWidths = data.defaultWidths ? data.defaultWidths : [12, 12, 12];
    }
}

export class StringChipsArrayDecoratorConfigInternal extends PropertyDecoratorConfigInternal implements StringChipsArrayDecoratorConfig {
    itemType: DecoratorTypes.STRING;
    displayStyle: 'chips';
    deleteHtml?: string;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;

    constructor(data: StringChipsArrayDecoratorConfig) {
        super(data);
        this.deleteHtml = data.deleteHtml;
        this.displayStyle = data.displayStyle;
        this.itemType = data.itemType;
        this.maxLength = data.maxLength;
        this.minLength = data.minLength;
        this.regex = data.regex;
        this.defaultWidths = data.defaultWidths ? data.defaultWidths : [6, 12, 12];
    }
}

export class AutocompleteStringChipsArrayDecoratorConfigInternal
    extends PropertyDecoratorConfigInternal implements AutocompleteStringChipsArrayDecoratorConfig {

    autocompleteValues: string[];
    itemType: DecoratorTypes.STRING_AUTOCOMPLETE;
    displayStyle: 'chips';
    deleteHtml?: string;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;

    constructor(data: AutocompleteStringChipsArrayDecoratorConfig) {
        super(data);
        this.autocompleteValues = data.autocompleteValues;
        this.deleteHtml = data.deleteHtml;
        this.displayStyle = data.displayStyle;
        this.itemType = data.itemType;
        this.maxLength = data.maxLength;
        this.minLength = data.minLength;
        this.regex = data.regex;
        this.defaultWidths = data.defaultWidths ? data.defaultWidths : [6, 12, 12];
    }
}