import { PropertyDecoratorConfig } from './base/property-decorator-config.interface';
import { baseProperty } from './base/base-property.decorator';
import { Entity } from '../classes/entity-model.class';
import { DecoratorTypes } from './base/decorator-types.enum';

/**
 * Decorator for setting and getting object propery metadata.
 * @param metadata The metadata of the object property
 */
export function object(metadata: DefaultObjectDecoratorConfig): (target: object, propertyKey: string) => void {
    return baseProperty(new DefaultObjectDecoratorConfig(metadata), DecoratorTypes.OBJECT);
}

/**
 * Interface definition for the @object metadata
 */
abstract class ObjectDecoratorConfig extends PropertyDecoratorConfig {
    /**
     * The entity type of the object
     */
    type!: typeof Entity;

    /**
     * How to display the object.
     * @inline The objects properties are added as input fields in an section of the entity.
     * Useful if the object only contains a few properties (e.g. a address on a user).
     */
    displayStyle!: 'inline';
}

export class DefaultObjectDecoratorConfig extends ObjectDecoratorConfig {
    override displayStyle: 'inline';
    /**
     * (optional) The title of the section containing all object properties. Defaults to the display name.
     */
    sectionTitle?: string;

    constructor(metadata: DefaultObjectDecoratorConfig) {
        super(
            metadata.displayName,
            metadata.display,
            metadata.required,
            metadata.omitForCreate,
            metadata.omitForUpdate,
            metadata.defaultWidths,
            metadata.order
        );
        this.displayStyle = metadata.displayStyle;
        this.type = metadata.type;
        this.sectionTitle = metadata.sectionTitle;
    }
}