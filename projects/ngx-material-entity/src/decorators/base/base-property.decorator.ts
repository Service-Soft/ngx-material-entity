import { DecoratorTypes } from './decorator-types.enum';
import { PropertyDecoratorConfigInternal } from './property-decorator-internal.data';

/**
 * The base decorator for setting metadata on properties.
 *
 * @param metadata - The metadata to define.
 * @param type - The type of metadata.
 * @returns The method that sets the metadata.
 */
export function baseProperty(metadata: PropertyDecoratorConfigInternal, type: DecoratorTypes) {
    return function (target: object, propertyKey: string) {
        Reflect.defineMetadata('metadata', metadata, target, propertyKey);
        Reflect.defineMetadata('type', type, target, propertyKey);
    };
}