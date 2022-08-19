import { string } from '../decorators/string/string.decorator';

/**
 * The newable type used whenever an entity class is passed to create an entity and initialize its metadata.
 */
export type EntityClassNewable<EntityType extends BaseEntityType<EntityType>> = new(data?: EntityType) => EntityType;

/**
 * The Generic Base EntityType.
 */
export type BaseEntityType<T> = { [K in keyof T]: unknown };

/**
 * A base Entity class with a builtin id.
 */
export abstract class Entity {
    /**
     * A unique identifier for the Entity.
     */
    @string({
        omitForCreate: true,
        omitForUpdate: true,
        display: false,
        displayStyle: 'line',
        displayName: 'ID',
        required: true
    })
    id!: string;
}