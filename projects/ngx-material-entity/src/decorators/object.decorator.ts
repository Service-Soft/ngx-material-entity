import { PropertyDecoratorConfig } from './base/property-decorator-config.interface';
import { baseProperty } from './base/base-property.decorator';
import { Entity } from '../classes/entity-model.class';
import { DecoratorTypes } from './base/decorator-types.enum';

/**
 * Decorator for setting and getting object propery metadata.
 *
 * @param metadata - The metadata of the object property.
 * @returns The method that defines the metadata.
 */
export function object<EntityType extends Entity>(
    metadata: DefaultObjectDecoratorConfig<EntityType>
): (target: object, propertyKey: string) => void {
    return baseProperty(new DefaultObjectDecoratorConfig(metadata), DecoratorTypes.OBJECT);
}

/**
 * Definition for the @object metadata.
 */
abstract class ObjectDecoratorConfig<EntityType extends Entity> extends PropertyDecoratorConfig {
    /**
     * The entity type of the object.
     */
    type!: new (entity?: EntityType) => EntityType;

    /**
     * How to display the object.
     *
     * The objects properties are added as input fields in an section of the entity.
     * Useful if the object only contains a few properties (e.g. A address on a user).
     */
    displayStyle!: 'inline';
}

export class DefaultObjectDecoratorConfig<EntityType extends Entity> extends ObjectDecoratorConfig<EntityType> {
    override displayStyle: 'inline';

    constructor(metadata: DefaultObjectDecoratorConfig<EntityType>) {
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
    }
}