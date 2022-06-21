import { DecoratorTypes } from './decorator-types.enum';
import { PropertyDecoratorConfig } from './property-decorator-config.interface';

/**
 * The base decorator for setting metadata on properties
 * @param metadata The metadata to define
 * @param type The type of metadata
 * @returns The function that sets the metadata
 */
export function baseProperty(metadata: PropertyDecoratorConfig, type: DecoratorTypes) {
    return function (target: object, propertyKey: string) {
        Reflect.defineMetadata('metadata', metadata, target, propertyKey);
        Reflect.defineMetadata('type', type, target, propertyKey);
    };
}