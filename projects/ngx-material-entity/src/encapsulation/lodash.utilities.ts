import { cloneDeep, isArray, isEqual, isNil, Many, omit, omitBy, PartialObject, ValueKeyIteratee } from 'lodash';

/**
 * Encapsulates all functionality of lodash.
 */
export abstract class LodashUtilities {

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexps,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are **not** supported.
     *
     * @param value - The value to compare.
     * @param other - The other value to compare.
     * @returns Returns `true` if the values are equivalent, else `false`.
     */
    static isEqual(value: unknown, other: unknown): boolean {
        return isEqual(value, other);
    }

    /**
     * This method is like _.clone except that it recursively clones value.
     *
     * @param value - The value to recursively clone.
     * @returns Returns the deep cloned value.
     */
    static cloneDeep<T>(value: T): T {
        return cloneDeep(value);
    }

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable properties of `object` that are not omitted.
     *
     * @param object - The source object.
     * @param paths - The property names to omit, specified
     * individually or in arrays.
     * @returns Returns the new object.
     */
    static omit<T extends object, K extends keyof T>(object: T | null | undefined, ...paths: Many<K>[]): Omit<T, K> {
        return omit(object, ...paths);
    }

    /**
     * Checks if `value` is `null` or `undefined`.
     *
     * @param value - The value to check.
     * @returns Returns `true` if `value` is nullish, else `false`.
     */
    static isNil(value: unknown): value is null | undefined {
        return isNil(value);
    }

    /**
     * The opposite of `_.pickBy`; this method creates an object composed of the
     * own and inherited enumerable properties of `object` that `predicate`
     * doesn't return truthy for.
     *
     * @param object - The source object.
     * @param predicate - The function invoked per property.
     * @returns Returns the new object.
     */
    static omitBy<T extends object>(object: T | null | undefined, predicate: ValueKeyIteratee<T[keyof T]>): PartialObject<T> {
        return omitBy(object, predicate);
    }

    /**
     * Checks if value is classified as an Array object.
     *
     * @param value - The value to check.
     * @returns Returns true if value is correctly classified, else false.
     */
    static isArray(value?: unknown): value is unknown[] {
        return isArray(value);
    }

    /* istanbul ignore next */
    /**
     * Checks if value is classified as an object that is not an array.
     *
     * @param value - The value to check.
     * @returns Returns true if value is correctly classified, else false.
     */
    static isObject(value?: unknown): value is object {
        return value !== null
            && typeof value === 'object'
            && !LodashUtilities.isArray(value);
    }
}