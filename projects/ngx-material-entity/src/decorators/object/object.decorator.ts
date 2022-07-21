import { baseProperty } from '../base/base-property.decorator';
import { Entity } from '../../classes/entity-model.class';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { DefaultObjectDecoratorConfig } from './object-decorator.data';
import { DefaultObjectDecoratorConfigInternal } from './object-decorator-internal.data';

/**
 * Decorator for setting and getting object property metadata.
 *
 * @param metadata - The metadata of the object property.
 * @returns The method that defines the metadata.
 */
export function object<EntityType extends Entity>(
    metadata: DefaultObjectDecoratorConfig<EntityType>
): (target: object, propertyKey: string) => void {
    return baseProperty(new DefaultObjectDecoratorConfigInternal(metadata), DecoratorTypes.OBJECT);
}