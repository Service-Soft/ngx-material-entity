import { EntityUtilities } from '../../classes/entity.utilities';
import { ReflectUtilities } from '../../encapsulation/reflect.utilities';
import { DecoratorType, DecoratorTypes } from './decorator-types.enum';

/**
 * The base decorator for setting metadata on properties.
 *
 * @param metadata - The metadata to define.
 * @param type - The type of metadata.
 * @param metadataKeysToReset - Any metadata keys which values should be set to undefined on reset.
 * @returns The method that sets the metadata.
 */
export function baseProperty<
    T extends DecoratorTypes,
    CustomMetadataType extends Record<string, unknown>
>(metadata: DecoratorType<T, CustomMetadataType>, type: T, metadataKeysToReset?: string[]) {
    return function (target: object, propertyKey: string) {
        ReflectUtilities.defineMetadata('metadata', metadata, target, propertyKey as keyof object);
        ReflectUtilities.defineMetadata('type', type, target, propertyKey as keyof object);
        // eslint-disable-next-line max-len
        ReflectUtilities.defineMetadata(EntityUtilities.METADATA_KEYS_TO_RESET_KEY, metadataKeysToReset, target, propertyKey as keyof object);
    };
}