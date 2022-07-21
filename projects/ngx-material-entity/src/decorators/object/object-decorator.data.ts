import { Entity } from '../../classes/entity-model.class';
import { PropertyDecoratorConfig } from '../base/property-decorator.data';

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

/**
 * The configuration options for a object property.
 */
export interface DefaultObjectDecoratorConfig<EntityType extends Entity> extends ObjectDecoratorConfig<EntityType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'inline'
}