import { DecoratorTypes } from './decorator-types.enum';
import { PropertyDecoratorConfig } from './property-decorator-config.interface';

export function baseProperty(metadata: PropertyDecoratorConfig, type: DecoratorTypes) {
    return function (target: object, propertyKey: string) {
        Reflect.defineMetadata('metadata', metadata, target, propertyKey);
        Reflect.defineMetadata('type', type, target, propertyKey);
    };
}