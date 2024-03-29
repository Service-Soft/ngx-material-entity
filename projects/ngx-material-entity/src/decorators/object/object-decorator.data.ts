import { BaseEntityType, EntityClassNewable } from '../../classes/entity.model';
import { PropertyDecoratorConfig } from '../base/property-decorator.data';

/**
 * Definition for the @object metadata.
 */
abstract class ObjectDecoratorConfig<EntityType extends BaseEntityType<EntityType>> extends PropertyDecoratorConfig<EntityType> {
    /**
     * The class of the object. Is used to call the constructor so that all metadata is initialized.
     */
    EntityClass!: EntityClassNewable<EntityType>;

    /**
     * How to display the object.
     *
     * The objects properties are added as input fields in an section of the entity.
     * Useful if the object only contains a few properties (e.g. A address on a user).
     */
    displayStyle!: 'inline';

    /**
     * Some properties of the objects entity class that should be omitted.
     */
    omit?: (keyof EntityType)[];
}

/**
 * The configuration options for a object property.
 */
export interface DefaultObjectDecoratorConfig<EntityType extends BaseEntityType<EntityType>> extends ObjectDecoratorConfig<EntityType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'inline'
}