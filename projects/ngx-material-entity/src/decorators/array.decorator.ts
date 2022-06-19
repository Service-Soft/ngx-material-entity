import { baseProperty } from './base/base-property.decorator';
import { DecoratorTypes } from './base/decorator-types.enum';
import { PropertyDecoratorConfig } from './base/property-decorator-config.interface';

/**
 * Decorator for setting and getting array propery metadata
 * @param metadata The metadata of the array property
 */
export function array(metadata: ArrayDecoratorConfig) {
    return baseProperty(new ArrayDecoratorConfig(metadata), DecoratorTypes.ARRAY);
}

/**
 * Interface definition for the @array metadata
 */
export class ArrayDecoratorConfig extends PropertyDecoratorConfig {
    /**
     * Whether or not the Array can be empty
     */
    canBeEmpty: boolean;

    /**
     * The type of the items inside the array
     */
    itemType: DecoratorTypes;

    constructor(metadata: ArrayDecoratorConfig) {
        super(metadata.displayName, metadata.display, metadata.required, metadata.omitForCreate, metadata.omitForUpdate);
        this.canBeEmpty = metadata.canBeEmpty;
        this.itemType = metadata.itemType;
    }
}