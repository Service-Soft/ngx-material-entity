import { isEqual } from 'lodash';
import { DecoratorType, DecoratorTypes } from '../decorators/base/decorator-types.enum';
import { PropertyDecoratorConfig } from '../decorators/base/property-decorator-config.interface';
import { DefaultNumberDecoratorConfig } from '../decorators/number.decorator';
import { AutocompleteStringDecoratorConfig, DefaultStringDecoratorConfig, TextboxStringDecoratorConfig } from '../decorators/string.decorator';
import { Entity } from './entity-model.class';

/**
 * Contains HelperMethods around handling Entities and their property-metadata
 */
export abstract class EntityUtilities {
    /**
     * Gets the properties to omit when updating the entity
     * @returns The properties which should be left out for updating a new Entity
     */
    static getOmitForUpdate<EntityType extends Entity>(entity: EntityType): (keyof EntityType)[] {
        const res: (keyof EntityType)[] = [];
        for (const key of Reflect.ownKeys(entity)) {
            const metadata = Reflect.getMetadata('metadata', entity, key) as PropertyDecoratorConfig;
            if (metadata.omitForUpdate) {
                res.push(key as keyof EntityType);
            }
        }
        return res;
    }

    /**
     * Gets the properties to omit when creating new entities
     * @returns The properties which should be left out for creating a new Entity
     */
    static getOmitForCreate<EntityType extends Entity>(entity: EntityType): (keyof EntityType)[] {
        const res: (keyof EntityType)[] = [];
        for (const key of Reflect.ownKeys(entity)) {
            const metadata = Reflect.getMetadata('metadata', entity, key) as PropertyDecoratorConfig;
            if (metadata.omitForCreate) {
                res.push(key as keyof EntityType);
            }
        }
        return res;
    }

    /**
     * Gets the metadata included in an property
     * @param entity The entity with the property to get the metadata from
     * @param propertyKey The property on the given Entity to get the metadata from
     * @param type For secure Typing, defines the returned PropertyConfig
     * @returns The metadata of the property
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
                    `Could not find metadata for property ${String(propertyKey)}
                    on the entity ${JSON.stringify(entity)}`
                );
            }
            return metadata ;
        }
        catch (error) {
            throw new Error(
                `Could not find metadata for property ${String(propertyKey)}
                on the entity ${JSON.stringify(entity)}`
            );
        }
    }

    /**
     * Gets the type of the property-metadata.
     * @param entity The entity with the property to get the type from
     * @param propertyKey The property on the given Entity to get the type from
     * @returns The type of the metadata
     */
    static getPropertyType<EntityType extends Entity>(
        entity: EntityType, propertyKey: keyof EntityType
    ): DecoratorTypes {
        try {
            const propertyType = Reflect.getMetadata('type', entity, propertyKey as string) as DecoratorTypes;
            if (!propertyType) {
                throw new Error(
                    `Could not find type metadata for property ${String(propertyKey)}
                    on the entity ${JSON.stringify(entity)}`
                );
            }
            return propertyType;
        }
        catch (error) {
            throw new Error(
                `Could not find type metadata for property ${String(propertyKey)}
                on the entity ${JSON.stringify(entity)}`
            );
        }
    }

    /**
     * Sets all property values based on a given entity data-object.
     * @param entity The data object to get the property values from.
     * @param target
     * the target object that needs to be constructed
     * (if called inside a Entity constructor its usually this)
     * @alias new
     * @alias build
     * @alias construct
     */
    static new<EntityType extends Entity>(target: EntityType, entity?: EntityType): void {
        if (entity) {
            for (const key in entity) {
                Reflect.set(target, key, Reflect.get(entity, key));
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    static construct = this.new;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    static build = this.new;

    /**
     * Checks if the values on an entity are valid.
     * Also checks all the validators given by the metadata ("required", "maxLength" etc.)
     * @param entity The entity to validate.
     * @returns Whether or not the entity is valid.
     */
    static isEntityValid<EntityType extends Entity>(entity: EntityType): boolean {
        for (const key in entity) {
            if (!this.isPropertyValid(entity, key)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks if a single property value is valid
     * @param entity The entity where the property is from
     * @param key The name of the property
     * @returns Whether or not the property value is valid
     */
    private static isPropertyValid<EntityType extends Entity>(entity: EntityType, key: keyof EntityType): boolean {
        const type = this.getPropertyType(entity, key);
        const metadata: PropertyDecoratorConfig = this.getPropertyMetadata(entity, key, type);
        const metadataDefaultString = metadata as DefaultStringDecoratorConfig;
        const metadataTextboxString = metadata as TextboxStringDecoratorConfig;
        const metadataAutocompleteString = metadata as AutocompleteStringDecoratorConfig;
        const metadataDefaultNumber = metadata as DefaultNumberDecoratorConfig;
        const objectProperty = entity[key] as unknown as EntityType;

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
                    && (entity[key] as unknown as string).match(metadataAutocompleteString.regex)
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
                if (metadataDefaultNumber.min && (entity[key] as unknown as number) > metadataDefaultNumber.min) {
                    return false;
                }
                break;
            case DecoratorTypes.OBJECT:
                for (const parameterKey in objectProperty) {
                    if (!this.isPropertyValid(objectProperty, parameterKey)) {
                        return false;
                    }
                }
                break;
            default:
                break;
        }
        return true;
    }

    /**
     * Checks if an entity is "dirty" (if its values have changed)
     * @param entity The entity after all changes
     * @param entityPriorChanges The entity before the changes
     * @returns Whether or not the entity is dirty
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
     * Compares two Entities and returns their difference in an object
     * @param entity The first entity to compare
     * @param entityPriorChanges The second entity to compare
     * @returns The difference between the two Entities in form of a Partial
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

    /**
     * compare function for sorting entity keys by their order value
     * @param a first key of entity
     * @param b second key of entity
     * @param entity current entity (used to get metadata of entity keys)
     */
    static compareOrder<EntityType extends Entity>(a: keyof EntityType, b: keyof EntityType, entity: EntityType): number {
        const metadataA = EntityUtilities.getPropertyMetadata(entity, a, EntityUtilities.getPropertyType(entity, a));
        const metadataB = EntityUtilities.getPropertyMetadata(entity, b, EntityUtilities.getPropertyType(entity, b));

        if (metadataA.order === -1) {
            return 1;
        }
        else if (metadataB.order === -1) {
            return 0;
        }

        return ((metadataA.order as number) - (metadataB.order as number));
    }

    /**
     * gets the bootstrap column values for "lg", "md", "sm"
     * @param entity entity to get the bootstrap column values of the key 
     * @param key key of the property to get bootstrap column values from
     * @param type defines for which screensize the column values should be returned 
     * @returns bootstrap column value
     */
    static getWidth<EntityType extends Entity>(entity: EntityType, key: keyof EntityType, type: 'lg' | 'md' | 'sm'): number {
        const propertyType = EntityUtilities.getPropertyType(entity, key);
        const metadata = EntityUtilities.getPropertyMetadata(entity, key, propertyType);
        if (metadata.defaultWidths) {
            switch (type) {
                case 'lg':
                    return metadata.defaultWidths[0];
                case 'md':
                    return metadata.defaultWidths[1];
                case 'sm':
                    return metadata.defaultWidths[2];
                default:
                    throw new Error('Something went wrong getting the width');
            }
        }
        else {
            throw new Error('Something went wrong getting the width');
        }
    }
}