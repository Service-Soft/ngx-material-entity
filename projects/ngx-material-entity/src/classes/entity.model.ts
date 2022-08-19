import { string } from '../decorators/string/string.decorator';

/**
 * The newable type used whenever an entity class is passed to create an entity and initialize its metadata.
 */
export type EntityClassNewable<EntityType extends BaseEntityType> = new(data?: EntityType) => EntityType;

/**
 * The Generic Base EntityType.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BaseEntityType = Record<string, any>;

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