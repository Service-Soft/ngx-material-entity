import { HttpClient } from '@angular/common/http';
import { DateFilterFn } from '@angular/material/datepicker';
import { BaseEntityType } from '../classes/entity.model';
import { DateRangeArrayDecoratorConfigInternal, EntityArrayDecoratorConfigInternal } from '../decorators/array/array-decorator-internal.data';
import { DecoratorType, DecoratorTypes } from '../decorators/base/decorator-types.enum';
import { PropertyDecoratorConfigInternal } from '../decorators/base/property-decorator-internal.data';
import { CustomDecoratorConfigInternal } from '../decorators/custom/custom-decorator-internal.data';
import { DateRangeDateDecoratorConfigInternal } from '../decorators/date/date-decorator-internal.data';
import { DateRange } from '../decorators/date/date-decorator.data';
import { DefaultFileDecoratorConfigInternal } from '../decorators/file/file-decorator-internal.data';
import { FileData } from '../decorators/file/file-decorator.data';
import { DefaultObjectDecoratorConfigInternal } from '../decorators/object/object-decorator-internal.data';
import { LodashUtilities } from '../encapsulation/lodash.utilities';
import { ReflectUtilities } from '../encapsulation/reflect.utilities';
import { DateUtilities } from './date.utilities';
import { FileUtilities } from './file.utilities';

/**
 * Shows information about differences between two entities.
 */
export interface Difference<EntityType extends BaseEntityType<EntityType>> {
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
     * The key for all keys of metadata that should be set to undefined when the entity gets reset.
     */
    static readonly METADATA_KEYS_TO_RESET_KEY: string = 'metadataKeysToReset';

    /**
     * The key for the metadata that saves the single preview image value on image properties.
     */
    static readonly SINGLE_PREVIEW_IMAGE_KEY: string = 'singlePreviewImage';

    /**
     * The key for the metadata that saves the multi preview images value on image properties.
     */
    static readonly MULTI_PREVIEW_IMAGES_KEY: string = 'multiPreviewImages';

    /**
     * The key for the metadata that saves the filenames value on file properties.
     */
    static readonly FILENAMES_KEY: string = 'fileNames';

    /**
     * The key for the metadata that saves the confirm password value on password properties.
     */
    static readonly CONFIRM_PASSWORD_KEY: string = 'confirmPassword';

    /**
     * The key for the metadata that saves the time value on date time properties.
     */
    static readonly TIME_KEY: string = 'time';

    /**
     * The key for the metadata that saves the date range value on date range properties.
     */
    static readonly DATE_RANGE_KEY: string = 'dateRange';

    /**
     * The key for the metadata that saves the date range start value on date range properties.
     */
    static readonly DATE_RANGE_START_KEY: string = 'dateRangeStart';

    /**
     * The key for the metadata that saves the date range end value on date range properties.
     */
    static readonly DATE_RANGE_END_KEY: string = 'dateRangeEnd';

    /**
     * Gets the properties to omit when updating the entity.
     *
     * @param entity - The entity to get the properties which should be left out for updating from.
     * @returns The properties which should be left out for updating an Entity.
     */
    static getOmitForUpdate<EntityType extends BaseEntityType<EntityType>>(entity: EntityType): (keyof EntityType)[] {
        const res: (keyof EntityType)[] = [];
        for (const key of ReflectUtilities.ownKeys(entity)) {
            const metadata: PropertyDecoratorConfigInternal<unknown> = this.getPropertyMetadata(entity, key);
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
    static getOmitForCreate<EntityType extends BaseEntityType<EntityType>>(entity: EntityType): (keyof EntityType)[] {
        const res: (keyof EntityType)[] = [];
        for (const key of ReflectUtilities.ownKeys(entity)) {
            const metadata: PropertyDecoratorConfigInternal<unknown> = this.getPropertyMetadata(entity, key);
            if (metadata.omitForCreate) {
                res.push(key);
            }
        }
        return res;
    }

    /**
     * Returns the given entity without the values that should be omitted for creation.
     *
     * @param entity - The entity with all its values.
     * @returns The reduced entity object.
     */
    static getWithoutOmitCreateValues<EntityType extends BaseEntityType<EntityType>>(entity: EntityType): Partial<EntityType> {
        return LodashUtilities.omit(entity, this.getOmitForCreate(entity)) as Partial<EntityType>;
    }

    /**
     * Returns the given entity without the values that should be omitted for updating.
     * This also handles omitting keys for @object or @array values and removes values that haven't been changed by default.
     *
     * @param entity - The entity with all its values.
     * @param entityPriorChanges - The entity before any changes were applied.
     * @param http - The angular HttpClient. Used to fetch files.
     * @returns The reduced entity object.
     */
    static async getWithoutOmitUpdateValues<EntityType extends BaseEntityType<EntityType>>(
        entity: EntityType,
        entityPriorChanges: EntityType,
        http: HttpClient
    ): Promise<Partial<EntityType>> {
        const res: Partial<EntityType> = {};
        for (const key of this.keysOf(entity, false, true)) {
            const metadata: PropertyDecoratorConfigInternal<unknown> = this.getPropertyMetadata(entity, key);
            const type: DecoratorTypes = this.getPropertyType(entity, key);
            if (!(await this.isEqual(entity[key], entityPriorChanges[key], metadata, type, http))) {
                switch (type) {
                    case DecoratorTypes.OBJECT:
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (res[key] as object) = LodashUtilities.omit(entity[key] as any, this.getOmitForCreate(entity[key]));
                        break;
                    case DecoratorTypes.ARRAY:
                        (res[key] as object[]) = (entity[key] as object[])
                            .map(value => LodashUtilities.omit(value, this.getOmitForCreate(value)));
                        break;
                    default:
                        res[key] = entity[key];
                        break;
                }
            }
        }
        return res;
    }

    /**
     * Sets all default values on the given entity.
     *
     * @param entity - The entity to set the default values on.
     */
    static setDefaultValues<EntityType extends BaseEntityType<EntityType>>(entity: EntityType): void {
        for (const key in entity) {
            const metadata: PropertyDecoratorConfigInternal<unknown> = this.getPropertyMetadata(entity, key);
            if (metadata.default) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
                entity[key] = metadata.default() as any;
            }
        }
    }

    /**
     * Gets all properties on the given entity which are files.
     *
     * @param entity - The entity to check for file properties.
     * @param omit - Whether to leave out values that are omitted for create or delete.
     * @returns The keys of all file properties on the given entity.
     */
    static getFileProperties<EntityType extends BaseEntityType<EntityType>>(
        entity: EntityType,
        omit?: 'create' | 'update'
    ): (keyof EntityType)[] {
        const res: (keyof EntityType)[] = [];
        for (const key of ReflectUtilities.ownKeys(entity)) {
            const type: DecoratorTypes = this.getPropertyType(entity, key);
            if (type === DecoratorTypes.FILE_DEFAULT || type === DecoratorTypes.FILE_IMAGE) {
                const metadata: PropertyDecoratorConfigInternal<unknown> = this.getPropertyMetadata(entity, key);
                if (!(metadata.omitForCreate && omit === 'create') && !(metadata.omitForUpdate && omit === 'update')) {
                    res.push(key);
                }
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
    static getPropertyMetadata<
        EntityType extends BaseEntityType<EntityType>,
        T extends DecoratorTypes,
        CustomMetadataType extends Record<string, unknown>
    >(
        entity: EntityType,
        propertyKey: keyof EntityType,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        type?: T
    ): DecoratorType<T, CustomMetadataType> {
        const metadata: unknown = ReflectUtilities.getMetadata('metadata', entity, propertyKey);
        if (metadata == null) {
            throw new Error(`Could not find metadata for property ${String(propertyKey)} on the entity ${JSON.stringify(entity)}`);
        }
        return metadata as DecoratorType<T, CustomMetadataType>;
    }

    /**
     * Gets the type of the property-metadata.
     *
     * @param entity - The entity with the property to get the type from.
     * @param propertyKey - The property on the given Entity to get the type from.
     * @returns The type of the metadata.
     * @throws Will throw an error if no metadata can be found for the given property.
     */
    static getPropertyType<EntityType extends BaseEntityType<EntityType>>(
        entity: EntityType, propertyKey: keyof EntityType
    ): DecoratorTypes {
        try {
            const propertyType: unknown = ReflectUtilities.getMetadata('type', entity, propertyKey);
            if (propertyType == null) {
                throw new Error(
                    `Could not find type metadata for property ${String(propertyKey)} on the entity ${JSON.stringify(entity)}`
                );
            }
            return propertyType as DecoratorTypes;
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
    static new<EntityType extends BaseEntityType<EntityType>>(target: EntityType, entity?: EntityType): void {
        for (const key in target) {
            const type: DecoratorTypes = this.getPropertyType(target, key);
            let value: unknown = entity ? ReflectUtilities.get(entity, key) : undefined;
            switch (type) {
                case DecoratorTypes.OBJECT:
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const objectMetadata: DefaultObjectDecoratorConfigInternal<any>
                        = this.getPropertyMetadata(target, key, DecoratorTypes.OBJECT);
                    value = new objectMetadata.EntityClass(value as object | undefined);
                    break;
                case DecoratorTypes.ARRAY:
                    const inputArray: EntityType[] | undefined = value as EntityType[] | undefined;
                    const resArray: EntityType[] = [];
                    if (inputArray) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const arrayMetadata: EntityArrayDecoratorConfigInternal<any>
                            = this.getPropertyMetadata(target, key, DecoratorTypes.ARRAY);
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
    // eslint-disable-next-line @typescript-eslint/member-ordering, jsdoc/require-jsdoc, @typescript-eslint/typedef
    static construct = this.new;
    // eslint-disable-next-line @typescript-eslint/member-ordering, jsdoc/require-jsdoc, @typescript-eslint/typedef
    static build = this.new;

    /**
     * Checks if an entity is "dirty" (if its values have changed).
     *
     * @param entity - The entity after all changes.
     * @param entityPriorChanges - The entity before the changes.
     * @param http - The angular HttpClient. Used to fetch files.
     * @returns Whether or not the entity is dirty.
     */
    static async isDirty<EntityType extends BaseEntityType<EntityType>>(
        entity: EntityType,
        entityPriorChanges: EntityType,
        http: HttpClient
    ): Promise<boolean> {
        if (!(entityPriorChanges as EntityType | undefined)) {
            return false;
        }
        const differences: Difference<EntityType>[] = await this.getDifferencesBetweenEntities(entity, entityPriorChanges, http);
        return differences.length ? true : false;
    }

    /**
     * Gets the differences between the two given entities.
     *
     * @param entity - The entity as is.
     * @param entityPriorChanges - The entity before any changes have been made.
     * @param http - The angular http client, is needed to check if files are equal.
     * @returns The differences as an array consisting of key, before and after.
     */
    static async getDifferencesBetweenEntities<EntityType extends BaseEntityType<EntityType>>(
        entity: EntityType,
        entityPriorChanges: EntityType,
        http: HttpClient
    ): Promise<Difference<EntityType>[]> {
        const res: Difference<EntityType>[] = [];
        for (const key of ReflectUtilities.ownKeys(entity)) {
            const metadata: PropertyDecoratorConfigInternal<unknown> = this.getPropertyMetadata(entity, key);
            const type: DecoratorTypes = this.getPropertyType(entity, key);
            if (!(await this.isEqual(entity[key], entityPriorChanges[key], metadata, type, http))) {
                res.push({
                    key: key,
                    before: entityPriorChanges[key],
                    after: entity[key]
                });
            }
            else {
                // This is needed to set blob file data so that it is only requested once.
                entityPriorChanges[key] = LodashUtilities.cloneDeep(entity[key]);
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
     * @param http - The angular HttpClient. Used to fetch files.
     * @returns Whether or not the given values are equal.
     */
    static async isEqual(
        value: unknown,
        valuePriorChanges: unknown,
        metadata: PropertyDecoratorConfigInternal<unknown>,
        type: DecoratorTypes,
        http: HttpClient
    ): Promise<boolean> {
        switch (type) {
            case DecoratorTypes.DATE_RANGE:
                return this.isEqualDateRange(
                    value,
                    valuePriorChanges,
                    (metadata as DateRangeDateDecoratorConfigInternal).filter
                );
            case DecoratorTypes.DATE:
                return this.isEqualDate(value, valuePriorChanges);
            case DecoratorTypes.DATE_TIME:
                return this.isEqualDateTime(value, valuePriorChanges);
            case DecoratorTypes.ARRAY_DATE:
            case DecoratorTypes.ARRAY_DATE_TIME:
                return this.isEqualArrayDate(value, valuePriorChanges);
            case DecoratorTypes.ARRAY_DATE_RANGE:
                return this.isEqualArrayDateRange(
                    value,
                    valuePriorChanges,
                    (metadata as DateRangeArrayDecoratorConfigInternal).filter
                );
            case DecoratorTypes.ARRAY_STRING_CHIPS:
            case DecoratorTypes.ARRAY_STRING_AUTOCOMPLETE_CHIPS:
                return this.isEqualArrayString(value, valuePriorChanges);
            case DecoratorTypes.FILE_IMAGE:
            case DecoratorTypes.FILE_DEFAULT:
                return this.isEqualFile(value, valuePriorChanges, (metadata as DefaultFileDecoratorConfigInternal).multiple, http);
            case DecoratorTypes.CUSTOM:
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return this.isEqualCustom(value, valuePriorChanges, metadata as CustomDecoratorConfigInternal<any, any, any, any>);
            default:
                return LodashUtilities.isEqual(value, valuePriorChanges);
        }
    }

    private static isEqualArrayString(value: unknown, valuePriorChanges: unknown): boolean | PromiseLike<boolean> {
        const stringArray: string[] = LodashUtilities.cloneDeep(value as string[]).sort();
        const stringArrayPriorChanges: string[] = LodashUtilities.cloneDeep(valuePriorChanges as string[]).sort();
        return LodashUtilities.isEqual(stringArray, stringArrayPriorChanges);
    }

    private static isEqualArrayDate(value: unknown, valuePriorChanges: unknown): boolean {
        const newValue: Date[] = (value as Date[]).map(v => new Date(v)).sort();
        const newValuePriorChanges: Date[] = (valuePriorChanges as Date[]).map(v => new Date(v)).sort();
        return LodashUtilities.isEqual(newValue, newValuePriorChanges);
    }

    private static isEqualArrayDateRange(value: unknown, valuePriorChanges: unknown, filter?: DateFilterFn<Date>): boolean {
        const dateRanges: DateRange[] = (value as DateRange[]).sort();
        const dateRangesPriorChanges: DateRange[] = (valuePriorChanges as DateRange[]).sort();
        if (dateRanges.length !== dateRangesPriorChanges.length) {
            return false;
        }
        for (let i: number = 0; i < dateRanges.length; i++) {
            if (!this.isEqualDateRange(dateRanges[i], dateRangesPriorChanges[i], filter)) {
                return false;
            }
        }
        return true;
    }

    private static isEqualDateTime(value: unknown, valuePriorChanges: unknown): boolean {
        const date: Date = new Date(value as Date);
        const datePriorChanges: Date = new Date(valuePriorChanges as Date);
        return LodashUtilities.isEqual(date, datePriorChanges);
    }

    private static isEqualDate(value: unknown, valuePriorChanges: unknown): boolean {
        const date: Date = new Date(value as Date);
        const datePriorChanges: Date = new Date(valuePriorChanges as Date);
        date.setHours(0, 0, 0, 0);
        datePriorChanges.setHours(0, 0, 0, 0);
        return LodashUtilities.isEqual(date, datePriorChanges);
    }

    private static isEqualDateRange(value: unknown, valuePriorChanges: unknown, filter?: DateFilterFn<Date>): boolean {
        const dateRange: DateRange = LodashUtilities.cloneDeep(value) as DateRange;
        dateRange.start = new Date((value as DateRange).start);
        dateRange.end = new Date((value as DateRange).end);
        dateRange.values = DateUtilities.getDatesBetween(
            dateRange.start,
            dateRange.end,
            filter
        );
        const dateRangePriorChanges: DateRange = LodashUtilities.cloneDeep(valuePriorChanges) as DateRange;
        dateRangePriorChanges.start = new Date((valuePriorChanges as DateRange).start);
        dateRangePriorChanges.end = new Date((valuePriorChanges as DateRange).end);
        dateRangePriorChanges.values = DateUtilities.getDatesBetween(
            dateRangePriorChanges.start,
            dateRangePriorChanges.end,
            filter
        );
        return LodashUtilities.isEqual(dateRange, dateRangePriorChanges);
    }

    // TODO: Find a way to use blobs with jest
    /* istanbul ignore next */
    private static async isEqualFile(value: unknown, valuePriorChanges: unknown, multiple: boolean, http: HttpClient): Promise<boolean> {
        if (value == null) {
            if (valuePriorChanges == null) {
                return true;
            }
            else {
                return false;
            }
        }
        const files: FileData[] = multiple ? (value as FileData[]).sort() : [value as FileData].sort();
        const filesPriorChanges: FileData[] = multiple ? (valuePriorChanges as FileData[]).sort() : [valuePriorChanges as FileData].sort();
        if (files.length !== filesPriorChanges.length) {
            return false;
        }
        for (let i: number = 0; i < files.length; i++) {
            // checks this before actually getting any files due to performance reasons.
            if (!LodashUtilities.isEqual(LodashUtilities.omit(files[i], 'file'), LodashUtilities.omit(filesPriorChanges[i], 'file'))) {
                return false;
            }
            if (filesPriorChanges[i].file && !files[i].file) {
                files[i] = await FileUtilities.getFileData(files[i], http);
                value = files[i];
            }
            if (files[i].file && !filesPriorChanges[i].file) {
                filesPriorChanges[i] = await FileUtilities.getFileData(filesPriorChanges[i], http);
                valuePriorChanges = filesPriorChanges[i];
            }
            if (!LodashUtilities.isEqual(await files[i].file?.text(), await filesPriorChanges[i].file?.text())) {
                return false;
            }
        }
        return true;
    }

    private static isEqualCustom(
        value: unknown,
        valuePriorChanges: unknown,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: CustomDecoratorConfigInternal<any, any, any, any>
    ): boolean {
        if (!metadata.isEqual(value, valuePriorChanges, metadata)) {
            return false;
        }
        return true;
    }

    /**
     * Compare function for sorting entity keys by their order value.
     *
     * @param a - First key of entity.
     * @param b - Second key of entity.
     * @param entity - Current entity (used to get metadata of entity keys).
     * @returns 0 if both values have the same order, a negative value if 'a' comes before 'b', a positive value if 'a' comes behind 'b'.
     */
    static compareOrder<EntityType extends BaseEntityType<EntityType>>(
        a: keyof EntityType,
        b: keyof EntityType,
        entity: EntityType
    ): number {
        const metadataA: PropertyDecoratorConfigInternal<unknown> = this.getPropertyMetadata(entity, a);
        const metadataB: PropertyDecoratorConfigInternal<unknown> = this.getPropertyMetadata(entity, b);

        if (metadataA.position.order === -1) {
            if (metadataB.position.order === -1) {
                return 0;
            }
            return 1;
        }
        else if (metadataB.position.order === -1) {
            return -1;
        }
        return metadataA.position.order - metadataB.position.order;
    }

    /**
     * Gets the bootstrap column values for "lg", "md", "sm".
     *
     * @param entity - Entity to get the bootstrap column values of the key.
     * @param key - Key of the property to get bootstrap column values from.
     * @param type - Defines for which screen size the column values should be returned.
     * @returns Bootstrap column value.
     */
    static getWidth<EntityType extends BaseEntityType<EntityType>>(
        entity: EntityType,
        key: keyof EntityType, type: 'lg' | 'md' | 'sm'
    ): number {
        const metadata: PropertyDecoratorConfigInternal<unknown> = this.getPropertyMetadata(entity, key);
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
    static resetChangesOnEntity<EntityType extends BaseEntityType<EntityType>>(entity: EntityType, entityPriorChanges: EntityType): void {
        for (const key in entityPriorChanges) {
            ReflectUtilities.set(entity, key, ReflectUtilities.get(entityPriorChanges, key));
            if (ReflectUtilities.hasMetadata(this.METADATA_KEYS_TO_RESET_KEY, entity, key)) {
                for (const k of (ReflectUtilities.getMetadata(this.METADATA_KEYS_TO_RESET_KEY, entity, key) as string[])) {
                    if (ReflectUtilities.hasMetadata(k, entity, key)) {
                        ReflectUtilities.defineMetadata(k, undefined, entity, key);
                    }
                }
            }
        }
    }

    private static getEntityRows<EntityType extends BaseEntityType<EntityType>>(
        entity: EntityType,
        tab: number,
        hideOmitForCreate: boolean,
        hideOmitForEdit: boolean,
        additionalOmitValues: (keyof EntityType)[]
    ): EntityRow<EntityType>[] {
        const res: EntityRow<EntityType>[] = [];

        const keys: (keyof EntityType)[] = this.keysOf(entity, hideOmitForCreate, hideOmitForEdit)
            .filter(k => !additionalOmitValues.includes(k));
        const numberOfRows: number = this.getNumberOfRows<EntityType>(keys, entity, tab);
        for (let i: number = 1; i <= numberOfRows; i++) {
            const row: EntityRow<EntityType> = {
                row: i,
                keys: this.getKeysForRow<EntityType>(keys, entity, i, tab)
            };
            res.push(row);
        }

        if (this.getKeysForRow<EntityType>(keys, entity, -1, tab).length) {
            const lastRow: EntityRow<EntityType> = {
                row: numberOfRows + 1,
                keys: this.getKeysForRow<EntityType>(keys, entity, -1, tab)
            };
            res.push(lastRow);
        }

        return res;
    }

    /**
     * Gets the tabs that are used to display the given entity.
     *
     * @param entity - The entity to get the rows from.
     * @param hideOmitForCreate - Whether or not keys with the metadata omitForCreate should be filtered out.
     * @param hideOmitForEdit - Whether or not keys with the metadata omitForUpdate should be filtered out.
     * @param additionalOmitValues - Additional omit values.
     * @returns The sorted Tabs containing the rows and the keys to display in that row.
     */
    static getEntityTabs<EntityType extends BaseEntityType<EntityType>>(
        entity: EntityType,
        hideOmitForCreate: boolean = false,
        hideOmitForEdit: boolean = false,
        additionalOmitValues: (keyof EntityType)[] = []
    ): EntityTab<EntityType>[] {
        const res: EntityTab<EntityType>[] = [];
        const keys: (keyof EntityType)[] = this.keysOf(entity, hideOmitForCreate, hideOmitForEdit)
            .filter(k => !additionalOmitValues.includes(k));
        const numberOfTabs: number = this.getNumberOfTabs<EntityType>(keys, entity);

        // eslint-disable-next-line max-len
        const firstTabRows: EntityRow<EntityType>[] = this.getEntityRows<EntityType>(entity, -1, hideOmitForCreate, hideOmitForEdit, additionalOmitValues);
        if (firstTabRows.length) {
            const firstTab: EntityTab<EntityType> = {
                tabName: this.getFirstTabName(entity),
                tab: -1,
                rows: firstTabRows
            };
            res.push(firstTab);
        }

        for (let i: number = 2; i <= numberOfTabs; i++) {
            const rows: EntityRow<EntityType>[] = this.getEntityRows<EntityType>(
                entity, i, hideOmitForCreate, hideOmitForEdit, additionalOmitValues
            );
            if (rows.length) {
                const tab: EntityTab<EntityType> = {
                    tabName: this.getTabName(entity, i),
                    tab: i,
                    rows: rows
                };
                res.push(tab);
            }
        }

        return res;
    }

    private static getKeysForRow<EntityType extends BaseEntityType<EntityType>>(
        keys: (keyof EntityType)[],
        entity: EntityType,
        row: number,
        tab: number
    ): (keyof EntityType)[] {
        return keys
            .filter(k => this.getPropertyMetadata(entity, k).position.row === row)
            .filter(k => this.getPropertyMetadata(entity, k).position.tab === tab)
            .sort((a, b) => this.compareOrder(a, b, entity));
    }

    private static getNumberOfRows<EntityType extends BaseEntityType<EntityType>>(
        keys: (keyof EntityType)[],
        entity: EntityType,
        tab: number
    ): number {
        return keys
            .filter(k => this.getPropertyMetadata(entity, k).position.tab === tab)
            .map(k => this.getPropertyMetadata(entity, k).position.row)
            .sort((a, b) => (a > b ? -1 : 1))[0];
    }

    private static getNumberOfTabs<EntityType extends BaseEntityType<EntityType>>(keys: (keyof EntityType)[], entity: EntityType): number {
        return keys
            .map(k => this.getPropertyMetadata(entity, k).position.tab)
            .sort((a, b) => (a > b ? -1 : 1))[0];
    }

    private static getTabName<EntityType extends BaseEntityType<EntityType>>(entity: EntityType, tab: number): string {
        const providedTabName: string | undefined = ReflectUtilities.ownKeys(entity)
            .map(k => this.getPropertyMetadata(entity, k))
            .find(m => m.position.tab === tab && m.position.tabName)?.position.tabName;
        return providedTabName ?? `Tab ${tab}`;
    }

    private static getFirstTabName<EntityType extends BaseEntityType<EntityType>>(entity: EntityType): string {
        const providedTabName: string | undefined = ReflectUtilities.ownKeys(entity)
            .map(k => this.getPropertyMetadata(entity, k))
            .find(m => m.position.tabName && m.position.tab === -1)?.position.tabName;
        return providedTabName ?? 'Tab 1';
    }

    /**
     * Gets the keys of the provided entity correctly typed.
     *
     * @param entity - The entity to get the keys of.
     * @param hideOmitForCreate - Whether or not keys with the metadata omitForCreate should be filtered out.
     * @param hideOmitForEdit - Whether or not keys with the metadata omitForUpdate should be filtered out.
     * @returns An array of keys of the entity.
     */
    static keysOf<EntityType extends BaseEntityType<EntityType>>(
        entity: EntityType,
        hideOmitForCreate: boolean = false,
        hideOmitForEdit: boolean = false
    ): (keyof EntityType)[] {
        let keys: (keyof EntityType)[] = ReflectUtilities.ownKeys(entity);
        const dontDisplayKeys: (keyof EntityType)[] = this.getDontDisplayKeys(entity);
        keys = keys.filter(k => !dontDisplayKeys.includes(k));
        if (hideOmitForCreate) {
            const omitForCreateKeys: (keyof EntityType)[] = this.getOmitForCreate(entity);
            keys = keys.filter(k => !omitForCreateKeys.includes(k));
        }
        if (hideOmitForEdit) {
            const omitForUpdateKeys: (keyof EntityType)[] = this.getOmitForUpdate(entity);
            keys = keys.filter(k => !omitForUpdateKeys.includes(k));
        }
        return keys;
    }

    private static getDontDisplayKeys<EntityType extends BaseEntityType<EntityType>>(entity: EntityType): (keyof EntityType)[] {
        const res: (keyof EntityType)[] = [];
        for (const key of ReflectUtilities.ownKeys(entity)) {
            const metadata: PropertyDecoratorConfigInternal<unknown> = this.getPropertyMetadata(entity, key);
            if (!metadata.display(entity)) {
                res.push(key);
            }
        }
        return res;
    }
}

/**
 * A row that contains information about how to display an entity.
 */
export interface EntityRow<EntityType extends BaseEntityType<EntityType>> {
    /**
     * The row in which this should be displayed.
     */
    row: number,
    /**
     * The keys of the values that should be displayed in that row.
     */
    keys: (keyof EntityType)[]
}

/**
 * A tab that contains all the information about how to display an entity.
 */
export interface EntityTab<EntityType extends BaseEntityType<EntityType>> {
    /**
     * The tab in which the rows should be displayed.
     */
    tab: number,
    /**
     * The name to display inside the tab.
     */
    tabName: string,
    /**
     * The rows that should be displayed inside this tab,.
     */
    rows: EntityRow<EntityType>[]
}