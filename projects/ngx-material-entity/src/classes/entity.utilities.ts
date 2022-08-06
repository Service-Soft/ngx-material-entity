import { DecoratorType, DecoratorTypes } from '../decorators/base/decorator-types.enum';
import { PropertyDecoratorConfigInternal } from '../decorators/base/property-decorator-internal.data';
import { DateRangeArrayDecoratorConfigInternal, EntityArrayDecoratorConfigInternal } from '../decorators/array/array-decorator-internal.data';
import { DefaultStringDecoratorConfigInternal, TextboxStringDecoratorConfigInternal } from '../decorators/string/string-decorator-internal.data';
import { DefaultNumberDecoratorConfigInternal } from '../decorators/number/number-decorator-internal.data';
import { DateRangeDateDecoratorConfigInternal, DateTimeDateDecoratorConfigInternal, DefaultDateDecoratorConfigInternal } from '../decorators/date/date-decorator-internal.data';
import { DateRange } from '../decorators/date/date-decorator.data';
import { Time } from '@angular/common';
import { DateUtilities } from './date.utilities';
import { ReflectUtilities } from '../capsulation/reflect.utilities';
import { LodashUtilities } from '../capsulation/lodash.utilities';
import { ToggleBooleanDecoratorConfigInternal } from '../decorators/boolean/boolean-decorator-internal.data';
import { DateFilterFn } from '@angular/material/datepicker';

/**
 * Shows information about differences between two entities.
 */
interface Difference<EntityType extends object> {
    /**
     * The key where the two entities have different values.
     */
    key: keyof EntityType,
    /**
     * The value before any changes.
     */
    before: unknown,
    /**
     * The current value after changes.
     */
    after: unknown
}

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
    static getOmitForUpdate<EntityType extends object>(entity: EntityType): (keyof EntityType)[] {
        const res: (keyof EntityType)[] = [];
        for (const key of EntityUtilities.keysOf(entity)) {
            const metadata = EntityUtilities.getPropertyMetadata(entity, key);
            if (metadata.omitForUpdate) {
                res.push(key);
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
    static getOmitForCreate<EntityType extends object>(entity: EntityType): (keyof EntityType)[] {
        const res: (keyof EntityType)[] = [];
        for (const key of EntityUtilities.keysOf(entity)) {
            const metadata = EntityUtilities.getPropertyMetadata(entity, key);
            if (metadata.omitForCreate) {
                res.push(key);
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
    static getPropertyMetadata<EntityType extends object, T extends DecoratorTypes>(
        entity: EntityType,
        propertyKey: keyof EntityType,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        type?: T
    ): DecoratorType<T> {
        try {
            const metadata = ReflectUtilities.getMetadata('metadata', entity, propertyKey) as DecoratorType<T>;
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
    static getPropertyType<EntityType extends object>(
        entity: EntityType, propertyKey: keyof EntityType
    ): DecoratorTypes {
        try {
            const propertyType = ReflectUtilities.getMetadata('type', entity, propertyKey) as DecoratorTypes;
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
    static new<EntityType extends object>(target: EntityType, entity?: EntityType): void {
        for (const key in target) {
            const type = EntityUtilities.getPropertyType(target, key);
            let value = entity ? ReflectUtilities.get(entity, key) : undefined;
            switch (type) {
                case DecoratorTypes.OBJECT:
                    const objectMetadata = EntityUtilities.getPropertyMetadata(target, key, DecoratorTypes.OBJECT);
                    value = new objectMetadata.EntityClass(value as object | undefined);
                    break;
                case DecoratorTypes.ARRAY:
                    const inputArray: EntityType[] = value as EntityType[];
                    const resArray: EntityType[] = [];
                    if (inputArray) {
                        const arrayMetadata = EntityUtilities.getPropertyMetadata(target, key, DecoratorTypes.ARRAY);
                        for (const item of inputArray) {
                            const itemWithMetadata: EntityType = new arrayMetadata.EntityClass(item) as EntityType;
                            resArray.push(itemWithMetadata);
                        }
                    }
                    value = resArray;
                    break;
                default:
                    break;
            }
            ReflectUtilities.set(target, key, value);
        }
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering, jsdoc/require-jsdoc
    static construct = EntityUtilities.new;
    // eslint-disable-next-line @typescript-eslint/member-ordering, jsdoc/require-jsdoc
    static build = EntityUtilities.new;

    /**
     * Checks if the values on an entity are valid.
     * Also checks all the validators given by the metadata ("required", "maxLength" etc.).
     *
     * @param entity - The entity to validate.
     * @param omit - Whether to check for creating or editing validity.
     * @returns Whether or not the entity is valid.
     */
    static isEntityValid<EntityType extends object>(entity: EntityType, omit: 'create' | 'update'): boolean {
        for (const key in entity) {
            if (!EntityUtilities.isPropertyValid(entity, key, omit)) {
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
    private static isPropertyValid<EntityType extends object>(
        entity: EntityType,
        key: keyof EntityType,
        omit: 'create' | 'update'
    ): boolean {
        const type = EntityUtilities.getPropertyType(entity, key);
        const metadata: PropertyDecoratorConfigInternal = EntityUtilities.getPropertyMetadata(entity, key, type);

        if (metadata.omitForCreate && omit === 'create') {
            return true;
        }
        if (metadata.omitForUpdate && omit === 'update') {
            return true;
        }
        if (metadata.required && entity[key] == null) {
            return false;
        }
        switch (type) {
            case DecoratorTypes.BOOLEAN_DROPDOWN:
                break;
            case DecoratorTypes.BOOLEAN_CHECKBOX:
            case DecoratorTypes.BOOLEAN_TOGGLE:
                const entityBoolean = entity[key] as unknown as boolean;
                const booleanMetadata = metadata as ToggleBooleanDecoratorConfigInternal;
                if (!this.isBooleanValid(entityBoolean, booleanMetadata)) {
                    return false;
                }
                break;
            case DecoratorTypes.STRING_DROPDOWN:
                break;
            case DecoratorTypes.STRING:
            case DecoratorTypes.STRING_AUTOCOMPLETE:
                const entityString = entity[key] as unknown as string;
                const stringMetadata = metadata as DefaultStringDecoratorConfigInternal;
                if (!this.isStringValid(entityString, stringMetadata)) {
                    return false;
                }
                break;
            case DecoratorTypes.STRING_TEXTBOX:
                const entityTextbox = entity[key] as unknown as string;
                const textboxMetadata = metadata as TextboxStringDecoratorConfigInternal;
                if (!this.isTextboxValid(entityTextbox, textboxMetadata)) {
                    return false;
                }
                break;
            case DecoratorTypes.NUMBER_DROPDOWN:
                return true;
            case DecoratorTypes.NUMBER:
                const entityNumber = entity[key] as unknown as number;
                const numberMetadata = metadata as DefaultNumberDecoratorConfigInternal;
                if (!this.isNumberValid(entityNumber, numberMetadata)) {
                    return false;
                }
                break;
            case DecoratorTypes.OBJECT:
                const entityObject = entity[key] as unknown as EntityType;
                for (const parameterKey in entityObject) {
                    if (!EntityUtilities.isPropertyValid(entityObject, parameterKey, omit)) {
                        return false;
                    }
                }
                break;
            case DecoratorTypes.ARRAY_STRING_CHIPS:
            case DecoratorTypes.ARRAY_STRING_AUTOCOMPLETE_CHIPS:
            case DecoratorTypes.ARRAY_DATE:
            case DecoratorTypes.ARRAY_DATE_TIME:
            case DecoratorTypes.ARRAY_DATE_RANGE:
            case DecoratorTypes.ARRAY:
                const entityArray = entity[key] as unknown as [];
                const arrayMetadata = metadata as EntityArrayDecoratorConfigInternal<EntityType>;
                if (arrayMetadata.required && !entityArray.length) {
                    return false;
                }
                break;
            case DecoratorTypes.DATE:
                const entityDate: Date = new Date(entity[key] as unknown as Date);
                const dateMetadata = metadata as DefaultDateDecoratorConfigInternal;
                if (!this.isDateValid(entityDate, dateMetadata)) {
                    return false;
                }
                break;
            case DecoratorTypes.DATE_RANGE:
                const entityDateRange: DateRange = LodashUtilities.cloneDeep(entity[key] as unknown as DateRange);
                const dateRangeMetadata = metadata as DateRangeDateDecoratorConfigInternal;
                if (!this.isDateRangeValid(entityDateRange, dateRangeMetadata)) {
                    return false;
                }
                break;
            case DecoratorTypes.DATE_TIME:
                const entityDateTime: Date = new Date(entity[key] as unknown as Date);
                const dateTimeMetadata = metadata as DateTimeDateDecoratorConfigInternal;
                if (!this.isDateTimeValid(entityDateTime, dateTimeMetadata)) {
                    return false;
                }
                break;
            default:
                throw new Error(`Could not validate the input because the DecoratorType ${type} is not known`);
        }
        return true;
    }

    private static isBooleanValid(value: boolean, metadata: ToggleBooleanDecoratorConfigInternal): boolean {
        if (metadata.required && !value) {
            return false;
        }
        return true;
    }

    private static isStringValid(value: string, metadata: DefaultStringDecoratorConfigInternal): boolean {
        if (metadata.maxLength && value.length > metadata.maxLength) {
            return false;
        }
        if (metadata.minLength && value.length < metadata.minLength) {
            return false;
        }
        if (metadata.regex && !value.match(metadata.regex)) {
            return false;
        }
        return true;
    }

    private static isTextboxValid(value: string, metadata: TextboxStringDecoratorConfigInternal): boolean {
        if (metadata.maxLength && value.length > metadata.maxLength) {
            return false;
        }
        if (metadata.minLength && value.length < metadata.minLength) {
            return false;
        }
        return true;
    }

    private static isNumberValid(value: number, metadata: DefaultNumberDecoratorConfigInternal): boolean {
        if (metadata.max && value > metadata.max) {
            return false;
        }
        if (metadata.min && value < metadata.min) {
            return false;
        }
        return true;
    }

    private static isDateValid(value: Date, metadata: DefaultDateDecoratorConfigInternal): boolean {
        if (metadata.min && value.getTime() < metadata.min(value).getTime()) {
            return false;
        }
        if (metadata.max && value.getTime() > metadata.max(value).getTime()) {
            return false;
        }
        if (metadata.filter && !metadata.filter(value)) {
            return false;
        }
        return true;
    }

    private static isDateRangeValid(value: DateRange, metadata: DateRangeDateDecoratorConfigInternal): boolean {
        if (metadata.required && (!value.start || !value.end)) {
            return false;
        }
        value.start = new Date(value.start);
        value.end = new Date(value.end);
        if (metadata.minStart && value.start.getTime() < metadata.minStart(value.start).getTime()) {
            return false;
        }
        if (metadata.maxStart && value.start.getTime() > metadata.maxStart(value.start).getTime()) {
            return false;
        }
        if (metadata.minEnd && value.end.getTime() < metadata.minEnd(value.end).getTime()) {
            return false;
        }
        if (metadata.maxEnd && value.end.getTime() > metadata.maxEnd(value.end).getTime()) {
            return false;
        }
        if (metadata.filter) {
            if (!metadata.filter(value.start)) {
                return false;
            }
            if (!metadata.filter(value.end)) {
                return false;
            }
            if (value.values) {
                for (const date of value.values) {
                    if (!metadata.filter(date)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    private static isDateTimeValid(value: Date, metadata: DateTimeDateDecoratorConfigInternal): boolean {
        if (metadata.minDate && value.getTime() < metadata.minDate(value).getTime()) {
            return false;
        }
        if (metadata.maxDate && value.getTime() > metadata.maxDate(value).getTime()) {
            return false;
        }
        if (metadata.filterDate && !metadata.filterDate(value)) {
            return false;
        }
        const time: Time = {
            hours: value.getHours(),
            minutes: value.getMinutes()
        }
        if (metadata.minTime) {
            const minTime: Time = metadata.minTime(value);
            if (
                !(
                    time.hours > minTime.hours
                    || (
                        time.hours === minTime.hours
                        && time.minutes >= minTime.minutes
                    )
                )
            ) {
                return false;
            }
        }
        if (metadata.maxTime) {
            const maxTime: Time = metadata.maxTime(value);
            if (
                !(
                    time.hours < maxTime.hours
                    || (
                        time.hours === maxTime.hours
                        && time.minutes <= maxTime.minutes
                    )
                )
            ) {
                return false;
            }
        }
        if (metadata.filterTime) {
            if (!metadata.filterTime(time)) {
                return false;
            }
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
    static dirty<EntityType extends object>(entity: EntityType, entityPriorChanges: EntityType): boolean {
        if (!entityPriorChanges) {
            return false;
        }
        else {
            const differences = this.differencesForDirty(entity, entityPriorChanges);
            return differences.length ? true : false;
        }
    }

    private static differencesForDirty<EntityType extends object>(
        entity: EntityType,
        entityPriorChanges: EntityType
    ): Difference<EntityType>[] {
        const res: Difference<EntityType>[] = [];
        for (const key in entity) {
            const metadata = EntityUtilities.getPropertyMetadata(entity, key);
            const type = EntityUtilities.getPropertyType(entity, key);
            if (!this.isEqual(entity[key], entityPriorChanges[key], metadata, type)) {
                res.push({
                    key: key,
                    before: entityPriorChanges[key],
                    after: entity[key]
                });
            }
        }
        return res;
    }

    /**
     * Compares two Entities and returns their difference in an object.
     *
     * @param entity - The first entity to compare.
     * @param entityPriorChanges - The second entity to compare.
     * @returns The difference between the two Entities in form of a Partial.
     */
    static difference<EntityType extends object>(
        entity: EntityType,
        entityPriorChanges: EntityType
    ): Partial<EntityType> {
        const res: Partial<EntityType> = {};
        for (const key in entity) {
            const metadata = EntityUtilities.getPropertyMetadata(entity, key);
            const type = EntityUtilities.getPropertyType(entity, key);
            if (!this.isEqual(entity[key], entityPriorChanges[key], metadata, type)) {
                res[key] = entity[key];
            }
        }
        return res;
    }

    /**
     * Checks if two given values are equal.
     * It uses the isEqual method from LodashUtilities and extends it with functionality regarding Dates.
     *
     * @param value - The updated value.
     * @param valuePriorChanges - The value before any changes.
     * @param metadata - The metadata of the property.
     * @param type - The type of the property.
     * @returns Whether or not the given values are equal.
     */
    static isEqual(value: unknown, valuePriorChanges: unknown, metadata: PropertyDecoratorConfigInternal, type: DecoratorTypes): boolean {
        switch (type) {
            case DecoratorTypes.DATE_RANGE:
                return this.isEqualDateRange(value, valuePriorChanges, (metadata as DateRangeDateDecoratorConfigInternal).filter);
            case DecoratorTypes.DATE:
                return this.isEqualDate(value, valuePriorChanges);
            case DecoratorTypes.DATE_TIME:
                return this.isEqualDateTime(value, valuePriorChanges);
            case DecoratorTypes.ARRAY_DATE:
            case DecoratorTypes.ARRAY_DATE_TIME:
                return this.isEqualArrayDate(value, valuePriorChanges);
            case DecoratorTypes.ARRAY_DATE_RANGE:
                return this.isEqualArrayDateRange(value, valuePriorChanges, (metadata as DateRangeArrayDecoratorConfigInternal).filter);
            default:
                return LodashUtilities.isEqual(value, valuePriorChanges);
        }
    }

    private static isEqualArrayDate(value: unknown, valuePriorChanges: unknown): boolean {
        const newValue = (value as Date[]).map(v => new Date(v)).sort();
        const newValuePriorChanges = (valuePriorChanges as Date[]).map(v => new Date(v)).sort();
        return LodashUtilities.isEqual(newValue, newValuePriorChanges);
    }

    private static isEqualArrayDateRange(value: unknown, valuePriorChanges: unknown, filter?: DateFilterFn<Date>): boolean {
        const newValue = (value as DateRange[]).map(v => {
            const dr: DateRange = {
                start: new Date(v.start),
                end: new Date(v.end),
                values: DateUtilities.getDatesBetween(
                    new Date(v.start),
                    new Date(v.end),
                    filter
                )
            };
            return dr;
        }).sort();
        const newValuePriorChanges = (valuePriorChanges as DateRange[]).map(v => {
            const dr: DateRange = {
                start: new Date(v.start),
                end: new Date(v.end),
                values: DateUtilities.getDatesBetween(
                    new Date(v.start),
                    new Date(v.end),
                    filter
                )
            };
            return dr;
        }).sort();
        return LodashUtilities.isEqual(newValue, newValuePriorChanges);
    }

    private static isEqualDateTime(value: unknown, valuePriorChanges: unknown): boolean {
        const date = new Date(value as Date);
        const datePriorChanges = new Date(valuePriorChanges as Date);
        return LodashUtilities.isEqual(date, datePriorChanges);
    }

    private static isEqualDate(value: unknown, valuePriorChanges: unknown): boolean {
        const date = new Date(value as Date);
        const datePriorChanges = new Date(valuePriorChanges as Date);
        date.setHours(0, 0, 0, 0);
        datePriorChanges.setHours(0, 0, 0, 0);
        return LodashUtilities.isEqual(date, datePriorChanges);
    }

    private static isEqualDateRange(value: unknown, valuePriorChanges: unknown, filter?: DateFilterFn<Date>): boolean {
        const dateRange = LodashUtilities.cloneDeep(value) as DateRange;
        dateRange.start = new Date((value as DateRange).start);
        dateRange.end = new Date((value as DateRange).end);
        dateRange.values = DateUtilities.getDatesBetween(
            dateRange.start,
            dateRange.end,
            filter
        );
        const dateRangePriorChanges = LodashUtilities.cloneDeep(valuePriorChanges) as DateRange;
        dateRangePriorChanges.start = new Date((valuePriorChanges as DateRange).start);
        dateRangePriorChanges.end = new Date((valuePriorChanges as DateRange).end);
        dateRangePriorChanges.values = DateUtilities.getDatesBetween(
            dateRangePriorChanges.start,
            dateRangePriorChanges.end,
            filter
        );
        return LodashUtilities.isEqual(dateRange, dateRangePriorChanges);
    }

    /**
     * Compare function for sorting entity keys by their order value.
     *
     * @param a - First key of entity.
     * @param b - Second key of entity.
     * @param entity - Current entity (used to get metadata of entity keys).
     * @returns 0 if both values have the same order, a negative value if 'a' comes before 'b', a positive value if 'a' comes behind 'b'.
     */
    static compareOrder<EntityType extends object>(a: keyof EntityType, b: keyof EntityType, entity: EntityType): number {
        const metadataA = EntityUtilities.getPropertyMetadata(entity, a);
        const metadataB = EntityUtilities.getPropertyMetadata(entity, b);

        if (metadataA.position.order === -1) {
            if (metadataB.position.order === -1) {
                return 0;
            }
            return 1;
        }
        else if (metadataB.position.order === -1) {
            return -1;
        }

        return ((metadataA.position.order ) - (metadataB.position.order ));
    }

    /**
     * Gets the bootstrap column values for "lg", "md", "sm".
     *
     * @param entity - Entity to get the bootstrap column values of the key.
     * @param key - Key of the property to get bootstrap column values from.
     * @param type - Defines for which screen size the column values should be returned.
     * @returns Bootstrap column value.
     */
    static getWidth<EntityType extends object>(entity: EntityType, key: keyof EntityType, type: 'lg' | 'md' | 'sm'): number {
        const metadata = EntityUtilities.getPropertyMetadata(entity, key);
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
    static resetChangesOnEntity<EntityType extends object>(entity: EntityType, entityPriorChanges: EntityType): void {
        for (const key in entityPriorChanges) {
            ReflectUtilities.set(entity, key, ReflectUtilities.get(entityPriorChanges, key));
        }
    }

    /**
     * Gets the rows that are used to display the given entity.
     *
     * @param entity - The entity to get the rows from.
     * @param hideOmitForCreate - Whether or not keys with the metadata omitForCreate should be filtered out.
     * @param hideOmitForEdit - Whether or not keys with the metadata omitForUpdate should be filtered out.
     * @returns The sorted Rows containing the row number and the keys to display in that row.
     */
    static getEntityRows<EntityType extends object>(
        entity: EntityType,
        hideOmitForCreate: boolean = false,
        hideOmitForEdit: boolean = false
    ): EntityRow<EntityType>[] {
        const res: EntityRow<EntityType>[] = [];

        const keys: (keyof EntityType)[] = EntityUtilities.keysOf(entity, hideOmitForCreate, hideOmitForEdit);
        const numberOfRows: number = this.getNumberOfRows<EntityType>(keys, entity);
        for (let i = 1; i <= numberOfRows; i++) {
            const row: EntityRow<EntityType> = {
                row: i,
                keys: this.getKeysForRow<EntityType>(keys, entity, i)
            };
            res.push(row);
        }
        const lastRow: EntityRow<EntityType> = {
            row: numberOfRows + 1,
            keys: this.getKeysForRow<EntityType>(keys, entity, -1)
        };
        res.push(lastRow);
        return res;
    }

    private static getKeysForRow<EntityType extends object>(
        keys: (keyof EntityType)[],
        entity: EntityType,
        i: number
    ): (keyof EntityType)[] {
        return keys
            .filter(k => EntityUtilities.getPropertyMetadata(entity, k).position.row === i)
            .sort((a, b) => EntityUtilities.compareOrder(a, b, entity));
    }

    private static getNumberOfRows<EntityType extends object>(keys: (keyof EntityType)[], entity: EntityType): number {
        return keys
            .map(k => EntityUtilities.getPropertyMetadata(entity, k).position.row)
            .sort((a, b) => (a > b ? -1 : 1))[0];
    }

    /**
     * Gets the keys of the provided entity correctly typed.
     *
     * @param entity - The entity to get the keys of.
     * @param hideOmitForCreate - Whether or not keys with the metadata omitForCreate should be filtered out.
     * @param hideOmitForEdit - Whether or not keys with the metadata omitForUpdate should be filtered out.
     * @returns An array of keys of the entity.
     */
    static keysOf<EntityType extends object>(
        entity: EntityType,
        hideOmitForCreate: boolean = false,
        hideOmitForEdit: boolean = false
    ): (keyof EntityType)[] {
        let keys: (keyof EntityType)[] = ReflectUtilities.ownKeys(entity);
        if (hideOmitForCreate) {
            const omitForCreateKeys: (keyof EntityType)[] = EntityUtilities.getOmitForCreate(entity);
            keys = keys.filter(k => !omitForCreateKeys.includes(k));
        }
        if (hideOmitForEdit) {
            const omitForUpdateKeys: (keyof EntityType)[] = EntityUtilities.getOmitForUpdate(entity);
            keys = keys.filter(k => !omitForUpdateKeys.includes(k));
        }
        return keys;
    }
}

/**
 * A row that contains all the information about how to display an entity.
 */
export interface EntityRow<EntityType extends object> {
    /**
     * The row in which this should be displayed.
     */
    row: number,
    /**
     * The keys of the values that should be displayed in that row.
     */
    keys: (keyof EntityType)[]
}