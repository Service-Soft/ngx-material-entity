import { ReflectUtilities } from '../../capsulation/reflect.utilities';
import { DecoratorType, DecoratorTypes } from './decorator-types.enum';

/**
 * The base decorator for setting metadata on properties.
 *
 * @param metadata - The metadata to define.
 * @param type - The type of metadata.
 * @returns The method that sets the metadata.
 */
export function baseProperty<
    T extends DecoratorTypes,
    CustomMetadataType extends Record<string, unknown>
>(metadata: DecoratorType<T, CustomMetadataType>, type: T) {
    return function (target: object, propertyKey: string) {
        ReflectUtilities.defineMetadata('metadata', metadata, target, propertyKey as keyof object);
        ReflectUtilities.defineMetadata('type', type, target, propertyKey as keyof object);
    };
}