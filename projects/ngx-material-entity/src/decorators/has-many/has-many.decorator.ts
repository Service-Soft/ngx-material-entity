import { BaseEntityType } from '../../classes/entity.model';
import { needsUpdateGlobalDefaults } from '../../default-global-configuration-values';
import { baseProperty } from '../base/base-property.decorator';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { HasManyDecoratorConfigInternal } from './has-many-decorator-internal.data';
import { HasManyDecoratorConfig } from './has-many-decorator.data';

/**
 * Decorator for setting and getting has many property metadata.
 *
 * @param metadata - The metadata of the has many property.
 * @returns The method that defines the metadata.
 */
export function hasMany<EntityType extends BaseEntityType<EntityType>, RelatedBaseEntityType extends BaseEntityType<RelatedBaseEntityType>>(
    metadata: HasManyDecoratorConfig<EntityType, RelatedBaseEntityType>
): (target: object, propertyKey: string) => void {
    return baseProperty(
        new HasManyDecoratorConfigInternal<EntityType, RelatedBaseEntityType>(
            metadata,
            needsUpdateGlobalDefaults
        ),
        DecoratorTypes.HAS_MANY
    );
}