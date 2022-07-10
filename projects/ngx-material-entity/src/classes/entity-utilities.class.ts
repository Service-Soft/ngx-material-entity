import { isEqual } from 'lodash';
import { DecoratorType, DecoratorTypes } from '../decorators/base/decorator-types.enum';
import { cols } from '../decorators/base/property-decorator.data';
import { Entity } from './entity-model.class';
import { PropertyDecoratorConfigInternal } from '../decorators/base/property-decorator-internal.data';
import { EntityArrayDecoratorConfigInternal } from '../decorators/array/array-decorator-internal.data';
import { AutocompleteStringDecoratorConfigInternal, DefaultStringDecoratorConfigInternal, TextboxStringDecoratorConfigInternal } from '../decorators/string/string-decorator-internal.data';
import { DefaultNumberDecoratorConfigInternal } from '../decorators/number/number-decorator-internal.data';

/**
 * Contains HelperMethods around handling Entities and their property-metadata.
 */
export abstract class EntityUtilities {

    /**
     * Gets the properties to omit when updating the entity.
     *
     * @param entity - The entity to get the properties which should be left out for updating from.
     * @returns The properties which should be left out for updating an Entity.
     */
    static getOmitForUpdate<EntityType extends Entity>(entity: EntityType): (keyof EntityType)[] {
        const res: (keyof EntityType)[] = [];
        for (const key of Reflect.ownKeys(entity)) {
            const metadata = Reflect.getMetadata('metadata', entity, key) as PropertyDecoratorConfigInternal;
            if (metadata.omitForUpdate) {
                res.push(key as keyof EntityType);
            }
        }
        return res;
    }

    /**
     * Gets the properties to omit when creating new entities.
     *
     * @param entity - The entity to get the properties which should be left out for creating from.
     * @returns The properties which should be left out for creating a new Entity.
     */
    static getOmitForCreate<EntityType extends Entity>(entity: EntityType): (keyof EntityType)[] {
        const res: (keyof EntityType)[] = [];
        for (const key of Reflect.ownKeys(entity)) {
            const metadata = Reflect.getMetadata('metadata', entity, key) as PropertyDecoratorConfigInternal;
            if (metadata.omitForCreate) {
                res.push(key as keyof EntityType);
            }
        }
        return res;
    }

    /**
     * Gets the metadata included in an property.
     *
     * @param entity - The entity with the property to get the metadata from.
     * @param propertyKey - The property on the given Entity to get the metadata from.
     * @param type - For secure Typing, defines the returned PropertyConfig.
     * @returns The metadata of the property.
     * @throws When no metadata can be found for the given property.
     */
    static getPropertyMetadata<EntityType extends Entity, T extends DecoratorTypes>(
        entity: EntityType,
        propertyKey: keyof EntityType,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        type: T
    ): DecoratorType<T> {
        try {
            const metadata = Reflect.getMetadata('metadata', entity, propertyKey as string) as DecoratorType<T>;
            if (!metadata) {
                throw new Error(
                    `Could not find metadata for property ${String(propertyKey)} on the entity ${JSON.stringify(entity)}`
                );
            }
            return metadata;
        }
        catch (error) {
            throw new Error(
                `Could not find metadata for property ${String(propertyKey)} on the entity ${JSON.stringify(entity)}`
            );
        }
    }

    /**
     * Gets the type of the property-metadata.
     *
     * @param entity - The entity with the property to get the type from.
     * @param propertyKey - The property on the given Entity to get the type from.
     * @returns The type of the metadata.
     * @throws Will throw an error if no metadata can be found for the given property.
     */
    static getPropertyType<EntityType extends Entity>(
        entity: EntityType, propertyKey: keyof EntityType
    ): DecoratorTypes {
        try {
            const propertyType = Reflect.getMetadata('type', entity, propertyKey as string) as DecoratorTypes;
            if (!propertyType) {
                throw new Error(
                    `Could not find type metadata for property ${String(propertyKey)} on the entity ${JSON.stringify(entity)}`
                );
            }
            return propertyType;
        }
        catch (error) {
            throw new Error(
                `Could not find type metadata for property ${String(propertyKey)} on the entity ${JSON.stringify(entity)}`
            );
        }
    }

    /**
     * Sets all property values based on a given entity data-object.
     *
     * @param target - The target object that needs to be constructed (if called inside an Entity constructor its usually this).
     * @param entity - The data object to get the property values from.
     * @alias new
     * @alias build
     * @alias construct
     */
    static new<EntityType extends Entity>(target: EntityType, entity?: EntityType): void {
        for (const key in target) {
            const type = EntityUtilities.getPropertyType(target, key);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            let value = entity ? Reflect.get(entity, key) : undefined;
            switch (type) {
                case DecoratorTypes.OBJECT:
                    const objectMetadata = EntityUtilities.getPropertyMetadata(target, key, DecoratorTypes.OBJECT);
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    value = new objectMetadata.type(value) as EntityType;
                    break;
                case DecoratorTypes.ARRAY:
                    const inputArray: EntityType[] = value as EntityType[];
                    const resArray: EntityType[] = [];
                    if (inputArray) {
                        const arrayMetadata = EntityUtilities.getPropertyMetadata(target, key, DecoratorTypes.ARRAY);
                        for (const item of inputArray) {
                            const itemWithMetadata = new arrayMetadata.EntityClass(item) as EntityType;
                            resArray.push(itemWithMetadata);
                        }
                    }
                    value = resArray;
                    break;
                default:
                    break;
            }
            Reflect.set(target, key, value);
        }
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    static construct = this.new;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    static build = this.new;

    /**
     * Checks if the values on an entity are valid.
     * Also checks all the validators given by the metadata ("required", "maxLength" etc.).
     *
     * @param entity - The entity to validate.
     * @param omit - Whether to check for creatiung or editing validity.
     * @returns Whether or not the entity is valid.
     */
    static isEntityValid<EntityType extends Entity>(entity: EntityType, omit: 'create' | 'update'): boolean {
        for (const key in entity) {
            if (!this.isPropertyValid(entity, key, omit)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks if a single property value is valid.
     *
     * @param entity - The entity where the property is from.
     * @param key - The name of the property.
     * @param omit - Whether to check if the given entity is valid for creation or updating.
     * @returns Whether or not the property value is valid.
     * @throws Throws when it extracts an unknown metadata type.
     */
    private static isPropertyValid<EntityType extends Entity>(
        entity: EntityType,
        key: keyof EntityType,
        omit: 'create' | 'update'
    ): boolean {
        const type = this.getPropertyType(entity, key);
        const metadata: PropertyDecoratorConfigInternal = this.getPropertyMetadata(entity, key, type);
        const metadataDefaultString = metadata as DefaultStringDecoratorConfigInternal;
        const metadataTextboxString = metadata as TextboxStringDecoratorConfigInternal;
        const metadataAutocompleteString = metadata as AutocompleteStringDecoratorConfigInternal;
        const metadataDefaultNumber = metadata as DefaultNumberDecoratorConfigInternal;
        const objectProperty = entity[key] as unknown as EntityType;
        const metadataEntityArray = metadata as EntityArrayDecoratorConfigInternal<Entity>;
        const arrayItems = entity[key] as unknown as [];

        if (metadata.omitForCreate && omit === 'create') {
            return true;
        }
        if (metadata.omitForUpdate && omit === 'update') {
            return true;
        }
        if (metadata.required && !entity[key]) {
            return false;
        }
        switch (type) {
            case DecoratorTypes.STRING:
                if (
                    metadataDefaultString.maxLength
                    && (entity[key] as unknown as string).length > metadataDefaultString.maxLength
                ) {
                    return false;
                }
                if (
                    metadataDefaultString.minLength
                    && (entity[key] as unknown as string).length < metadataDefaultString.minLength
                ) {
                    return false;
                }
                if (
                    metadataDefaultString.regex
                    && !(entity[key] as unknown as string).match(metadataDefaultString.regex)
                ) {
                    return false;
                }
                break;
            case DecoratorTypes.STRING_AUTOCOMPLETE:
                if (
                    metadataAutocompleteString.maxLength
                    && (entity[key] as unknown as string).length > metadataAutocompleteString.maxLength
                ) {
                    return false;
                }
                if (
                    metadataAutocompleteString.minLength
                    && (entity[key] as unknown as string).length < metadataAutocompleteString.minLength
                ) {
                    return false;
                }
                if (
                    metadataAutocompleteString.regex
                    && !(entity[key] as unknown as string).match(metadataAutocompleteString.regex)
                ) {
                    return false;
                }
                break;
            case DecoratorTypes.STRING_TEXTBOX:
                if (
                    metadataTextboxString.maxLength
                    && (entity[key] as unknown as string).length > metadataTextboxString.maxLength
                ) {
                    return false;
                }
                if (
                    metadataTextboxString.minLength
                    && (entity[key] as unknown as string).length < metadataTextboxString.minLength
                ) {
                    return false;
                }
                break;
            case DecoratorTypes.NUMBER:
                if (metadataDefaultNumber.max && (entity[key] as unknown as number) > metadataDefaultNumber.max) {
                    return false;
                }
                if (metadataDefaultNumber.min && (entity[key] as unknown as number) < metadataDefaultNumber.min) {
                    return false;
                }
                break;
            case DecoratorTypes.OBJECT:
                for (const parameterKey in objectProperty) {
                    if (!this.isPropertyValid(objectProperty, parameterKey, omit)) {
                        return false;
                    }
                }
                break;
            case DecoratorTypes.ARRAY_STRING_CHIPS:
            case DecoratorTypes.ARRAY_STRING_AUTOCOMPLETE_CHIPS:
            case DecoratorTypes.ARRAY:
                if (metadataEntityArray.required && !arrayItems.length) {
                    return false;
                }
                break;
            default:
                throw new Error(`Could not validate the input because the DecoratorType ${type} is not known`);
        }
        return true;
    }

    /**
     * Checks if an entity is "dirty" (if its values have changed).
     *
     * @param entity - The entity after all changes.
     * @param entityPriorChanges - The entity before the changes.
     * @returns Whether or not the entity is dirty.
     */
    static dirty(entity: Entity, entityPriorChanges: Entity): boolean {
        if (!entityPriorChanges) {
            return false;
        }
        else {
            const diff = this.difference(entity, entityPriorChanges);
            if (JSON.stringify(diff) === '{}') {
                return false;
            }
            else {
                return true;
            }
        }
    }

    /**
     * Compares two Entities and returns their difference in an object.
     *
     * @param entity - The first entity to compare.
     * @param entityPriorChanges - The second entity to compare.
     * @returns The difference between the two Entities in form of a Partial.
     */
    static difference<EntityType extends Entity>(
        entity: EntityType,
        entityPriorChanges: EntityType
    ): Partial<EntityType> {
        const res: Partial<EntityType> = {};
        for (const key in entity) {
            if (!isEqual(entity[key], entityPriorChanges[key])) {
                res[key] = entity[key];
            }
        }
        return res;
    }

    //TODO X Y
    /**
     * Compare function for sorting entity keys by their order value.
     *
     * @param a - First key of entity.
     * @param b - Second key of entity.
     * @param entity - Current entity (used to get metadata of entity keys).
     * @returns 0 if both values have the same order, a negative value if X, a positive value if Y.
     */
    static compareOrder<EntityType extends Entity>(a: keyof EntityType, b: keyof EntityType, entity: EntityType): number {
        const metadataA = EntityUtilities.getPropertyMetadata(entity, a, EntityUtilities.getPropertyType(entity, a));
        const metadataB = EntityUtilities.getPropertyMetadata(entity, b, EntityUtilities.getPropertyType(entity, b));

        if (metadataA.order === -1) {
            if (metadataB.order === -1) {
                return 0;
            }
            return 1;
        }
        else if (metadataB.order === -1) {
            return -1;
        }

        return ((metadataA.order ) - (metadataB.order ));
    }

    /**
     * Gets the bootstrap column values for "lg", "md", "sm".
     *
     * @param entity - Entity to get the bootstrap column values of the key.
     * @param key - Key of the property to get bootstrap column values from.
     * @param type - Defines for which screensize the column values should be returned.
     * @returns Bootstrap column value.
     */
    static getWidth<EntityType extends Entity>(entity: EntityType, key: keyof EntityType, type: 'lg' | 'md' | 'sm'): number {
        const propertyType = EntityUtilities.getPropertyType(entity, key);
        const metadata = EntityUtilities.getPropertyMetadata(entity, key, propertyType);
        metadata.defaultWidths = metadata.defaultWidths as [cols, cols, cols];
        switch (type) {
            case 'lg':
                return metadata.defaultWidths[0];
            case 'md':
                return metadata.defaultWidths[1];
            case 'sm':
                return metadata.defaultWidths[2];
        }
    }

    /**
     * Resets all changes on an entity.
     *
     * @param entity - The entity to reset.
     * @param entityPriorChanges - The entity before any changes.
     */
    static resetChangesOnEntity<EntityType extends Entity>(entity: EntityType, entityPriorChanges: EntityType): void {
        for (const key in entityPriorChanges) {
            Reflect.set(entity, key, Reflect.get(entityPriorChanges, key));
        }
    }
}