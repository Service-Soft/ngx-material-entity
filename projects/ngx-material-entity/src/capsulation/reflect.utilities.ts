
/**
 * Encapsulates all functionality of Reflect.
 */
export abstract class ReflectUtilities {
    /**
     * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
     *
     * @param metadataKey - A key used to store and retrieve metadata.
     * @param target - The target object on which the metadata is defined.
     * @param propertyKey - The property key for the target.
     * @returns The metadata value for the metadata key if found; otherwise, undefined.
     */
    static getMetadata<T extends object>(metadataKey: string, target: T, propertyKey: keyof T): unknown {
        return Reflect.getMetadata(metadataKey, target, propertyKey as string);
    }

    /**
     * Returns the string and symbol keys of the own properties of an object. The own properties of an object
     * are those that are defined directly on that object, and are not inherited from the object's prototype.
     *
     * @param target - Object that contains the own properties.
     * @returns The keys of the given object.
     */
    static ownKeys<T extends object>(target: T): (keyof T)[] {
        return Reflect.ownKeys(target) as (keyof T)[];
    }

    /**
     * Gets the property of target, equivalent to `target[propertyKey]`.
     *
     * @param target - Object that contains the property on itself or in its prototype chain.
     * @param propertyKey - The property name.
     * @returns The property of the target of the given key.
     */
    static get<T extends object>(target: T, propertyKey: keyof T): unknown {
        return Reflect.get(target, propertyKey);
    }

    /**
     * Sets the property of target, equivalent to `target[propertyKey] = value`.
     *
     * @param target - Object that contains the property on itself or in its prototype chain.
     * @param propertyKey - The property name.
     * @param value - The value to set the property to.
     * @returns If setting the value was successful.
     */
    static set<T extends object>(target: T, propertyKey: keyof T, value: unknown): boolean {
        return Reflect.set(target, propertyKey, value);
    }

    /**
     * Equivalent to `propertyKey in target`.
     *
     * @param target - Object that contains the property on itself or in its prototype chain.
     * @param propertyKey - Name of the property.
     * @returns Whether or not the given target has the key.
     */
    static has<T extends object>(target: T, propertyKey: keyof T): boolean {
        return Reflect.has(target, propertyKey);
    }

    /**
     * Define a unique metadata entry on the target.
     *
     * @param metadataKey - A key used to store and retrieve metadata.
     * @param metadataValue - A value that contains attached metadata.
     * @param target - The target object on which to define metadata.
     * @param propertyKey - The property key for the target.
     */
    static defineMetadata<T extends object>(
        metadataKey: unknown,
        metadataValue: unknown,
        target: T,
        propertyKey: keyof T
    ): void {
        Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey as string);
    }
}