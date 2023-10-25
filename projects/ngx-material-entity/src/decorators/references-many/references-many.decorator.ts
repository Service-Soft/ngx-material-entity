import { BaseEntityType } from '../../classes/entity.model';
import { needsUpdateGlobalDefaults } from '../../default-global-configuration-values';
import { baseProperty } from '../base/base-property.decorator';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { ReferencesManyDecoratorConfigInternal } from './references-many-decorator-internal.data';
import { ReferencesManyDecoratorConfig } from './references-many-decorator.data';

/**
 * Decorator for setting and getting references many property metadata.
 * @param metadata - The metadata of the references many property.
 * @returns The method that defines the metadata.
 */
export function referencesMany<EntityType extends BaseEntityType<EntityType>>(
    metadata: ReferencesManyDecoratorConfig<EntityType>
): (target: object, propertyKey: string) => void {
    return baseProperty(
        new ReferencesManyDecoratorConfigInternal<EntityType>(metadata, needsUpdateGlobalDefaults),
        DecoratorTypes.REFERENCES_MANY
    );
}