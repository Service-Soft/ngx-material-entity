import { BaseEntityType } from '../../classes/entity.model';
import { baseProperty } from '../base/base-property.decorator';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { ReferencesOneDecoratorConfigInternal } from './references-one-decorator-internal.data';
import { ReferencesOneDecoratorConfig } from './references-one-decorator.data';

/**
 * Decorator for setting and getting references one property metadata.
 * @param metadata - The metadata of the references one property.
 * @returns The method that defines the metadata.
 */
export function referencesOne<EntityType extends BaseEntityType<EntityType>>(
    metadata: ReferencesOneDecoratorConfig<EntityType>
): (target: object, propertyKey: string) => void {
    return baseProperty(new ReferencesOneDecoratorConfigInternal<EntityType>(metadata), DecoratorTypes.REFERENCES_ONE);
}