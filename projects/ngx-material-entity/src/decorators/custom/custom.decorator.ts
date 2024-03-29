import { BaseEntityType } from '../../classes/entity.model';
import { baseProperty } from '../base/base-property.decorator';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { CustomDecoratorConfigInternal } from './custom-decorator-internal.data';
import { CustomDecoratorConfig } from './custom-decorator.data';

/**
 * Decorator for setting and getting custom property metadata.
 * @param metadata - The metadata of the custom property.
 * @param metadataKeysToReset - Any metadata keys which values should be set to undefined on reset.
 * @returns The method that defines the metadata.
 */
export function custom<
    ValueType,
    CustomMetadataType extends BaseEntityType<CustomMetadataType>,
    EntityType extends BaseEntityType<EntityType>
>(
    metadata: CustomDecoratorConfig<
        EntityType,
        ValueType,
        CustomMetadataType,
        // eslint-disable-next-line typescript/no-explicit-any
        any
    >,
    metadataKeysToReset?: string[]
): (target: object, propertyKey: string) => void {
    return baseProperty<DecoratorTypes.CUSTOM, CustomMetadataType>(
        new CustomDecoratorConfigInternal(metadata),
        DecoratorTypes.CUSTOM,
        metadataKeysToReset
    );
}