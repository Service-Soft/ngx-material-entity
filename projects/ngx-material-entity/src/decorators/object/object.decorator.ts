import { DefaultObjectDecoratorConfigInternal, DropdownObjectDecoratorConfigInternal } from './object-decorator-internal.data';
import { DefaultObjectDecoratorConfig, DropdownObjectDecoratorConfig } from './object-decorator.data';
import { BaseEntityType } from '../../classes/entity.model';
import { baseProperty } from '../base/base-property.decorator';
import { DecoratorTypes } from '../base/decorator-types.enum';

/**
 * Decorator for setting and getting object property metadata.
 * @param metadata - The metadata of the object property.
 * @returns The method that defines the metadata.
 */
export function object<EntityType extends BaseEntityType<EntityType>>(
    metadata: DefaultObjectDecoratorConfig<EntityType> | DropdownObjectDecoratorConfig<EntityType>
): (target: object, propertyKey: string) => void {
    switch (metadata.displayStyle) {
        case 'dropdown':
            return baseProperty(new DropdownObjectDecoratorConfigInternal(metadata), DecoratorTypes.OBJECT_DROPDOWN);
        default:
            return baseProperty(new DefaultObjectDecoratorConfigInternal(metadata), DecoratorTypes.OBJECT);
    }
}