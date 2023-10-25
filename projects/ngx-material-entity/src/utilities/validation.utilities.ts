import { Time } from '@angular/common';
import { BaseEntityType } from '../classes/entity.model';
import { EntityArrayDecoratorConfigInternal } from '../decorators/array/array-decorator-internal.data';
import { DecoratorTypes } from '../decorators/base/decorator-types.enum';
import { PropertyDecoratorConfigInternal } from '../decorators/base/property-decorator-internal.data';
import { ToggleBooleanDecoratorConfigInternal } from '../decorators/boolean/boolean-decorator-internal.data';
import { CustomDecoratorConfigInternal } from '../decorators/custom/custom-decorator-internal.data';
import { DateRangeDateDecoratorConfigInternal, DateTimeDateDecoratorConfigInternal, DefaultDateDecoratorConfigInternal } from '../decorators/date/date-decorator-internal.data';
import { DateRange } from '../decorators/date/date-decorator.data';
import { DefaultFileDecoratorConfigInternal } from '../decorators/file/file-decorator-internal.data';
import { FileData } from '../decorators/file/file-decorator.data';
import { DefaultNumberDecoratorConfigInternal } from '../decorators/number/number-decorator-internal.data';
import { DefaultObjectDecoratorConfigInternal } from '../decorators/object/object-decorator-internal.data';
import { DefaultStringDecoratorConfigInternal, PasswordStringDecoratorConfigInternal, TextboxStringDecoratorConfigInternal } from '../decorators/string/string-decorator-internal.data';
import { LodashUtilities } from '../encapsulation/lodash.utilities';
import { ReflectUtilities } from '../encapsulation/reflect.utilities';
import { DateUtilities } from './date.utilities';
import { EntityUtilities } from './entity.utilities';
import { FileUtilities } from './file.utilities';

/**
 * A validation error reported by the validation utilities.
 * Consists of the property name where the error originated from and a message.
 */
export interface ValidationError {
    /**
     * The property name on which the error occurred. This is the displayName value.
     */
    property: string,
    /**
     * The validation error message.
     */
    message: string
}

/**
 * Contains HelperMethods around handling Validation of entities and properties.
 */
export abstract class ValidationUtilities {
    /**
     * Checks if the values on an entity are valid.
     * Also checks all the validators given by the metadata ("required", "maxLength" etc.).
     * @param entity - The entity to validate.
     * @param omit - Whether to check for creating or editing validity.
     * @returns Whether or not the entity is valid.
     */
    static isEntityValid<EntityType extends BaseEntityType<EntityType>>(entity: EntityType, omit?: 'create' | 'update'): boolean {
        return this.getEntityValidationErrors(entity, omit).length === 0;
    }

    /**
     * Gets all validation errors on the given entity.
     * @param entity - The entity to validate.
     * @param omit - What keys not to check. An empty value means no keys are omitted.
     * @returns An array of validation errors on the provided entity.
     */
    static getEntityValidationErrors<EntityType extends BaseEntityType<EntityType>>(
        entity: EntityType,
        omit?: 'create' | 'update'
    ): ValidationError[] {
        const res: ValidationError[] = [];
        for (const key in entity) {
            const err: ValidationError | undefined = this.getPropertyValidationError(entity, key, omit);
            if (err) {
                res.push(err);
            }
        }
        return res;
    }

    // /**
    //  * Checks if a single property value is valid.
    //  *
    //  * @param entity - The entity where the property is from.
    //  * @param key - The name of the property.
    //  * @param omit - Whether to check if the given entity is valid for creation or updating.
    //  * @returns Whether or not the property value is valid.
    //  * @throws Throws when it extracts an unknown metadata type.
    //  */
    // static isPropertyValid<EntityType extends BaseEntityType<EntityType>>(
    //     entity: EntityType,
    //     key: keyof EntityType,
    //     omit?: 'create' | 'update'
    // ): boolean {
    //     return this.getPropertyValidationError(entity, key, omit) == null;
    // }

    /**
     * Validates the property on the given entity with the given key.
     * @param entity - The entity on which the property to check is.
     * @param key - The key of the property to validate.
     * @param omit - What keys not to check. An empty value means no keys are omitted.
     * @returns A validation error when the property is not valid, undefined otherwise.
     * @throws When the type of the property is not known.
     */
    static getPropertyValidationError<EntityType extends BaseEntityType<EntityType>>(
        entity: EntityType,
        key: keyof EntityType,
        omit?: 'create' | 'update'
    ): ValidationError | undefined {
        const type: DecoratorTypes = EntityUtilities.getPropertyType(entity, key);
        const metadata: PropertyDecoratorConfigInternal<unknown> = EntityUtilities.getPropertyMetadata(entity, key, type);

        if (metadata.omitForCreate && omit === 'create') {
            return undefined;
        }
        if (metadata.omitForUpdate && omit === 'update') {
            return undefined;
        }
        if (metadata.required(entity) && type !== DecoratorTypes.HAS_MANY) {
            if (entity[key] == null || entity[key] === '') {
                return {
                    property: metadata.displayName,
                    message: 'required'
                };
            }
        }
        if (!metadata.required(entity)) {
            if (entity[key] == null || entity[key] === '') {
                return undefined;
            }
        }
        switch (type) {
            case DecoratorTypes.BOOLEAN_DROPDOWN:
                break;
            case DecoratorTypes.BOOLEAN_CHECKBOX:
            case DecoratorTypes.BOOLEAN_TOGGLE:
                const entityBoolean: boolean = entity[key] as boolean;
                const booleanMetadata: ToggleBooleanDecoratorConfigInternal = metadata as ToggleBooleanDecoratorConfigInternal;
                return this.getBooleanValidationError(entity, entityBoolean, booleanMetadata);
            case DecoratorTypes.STRING_DROPDOWN:
                break;
            case DecoratorTypes.STRING:
            case DecoratorTypes.STRING_AUTOCOMPLETE:
                const entityString: string = entity[key] as string;
                const stringMetadata: DefaultStringDecoratorConfigInternal = metadata as DefaultStringDecoratorConfigInternal;
                return this.getStringValidationError(entityString, stringMetadata);
            case DecoratorTypes.STRING_TEXTBOX:
                const entityTextbox: string = entity[key] as string;
                const textboxMetadata: TextboxStringDecoratorConfigInternal = metadata as TextboxStringDecoratorConfigInternal;
                return this.getTextboxValidationError(entityTextbox, textboxMetadata);
            case DecoratorTypes.STRING_PASSWORD:
                const entityPassword: string = entity[key] as string;
                const passwordMetadata: PasswordStringDecoratorConfigInternal = metadata as PasswordStringDecoratorConfigInternal;
                const confirmPassword: string = ReflectUtilities.getMetadata(EntityUtilities.CONFIRM_PASSWORD_KEY, entity, key) as string;
                return this.getPasswordValidationError(entityPassword, passwordMetadata, confirmPassword);
            case DecoratorTypes.NUMBER_DROPDOWN:
                // Because only valid values can be selected, this is always true when it has a value
                return undefined;
            case DecoratorTypes.NUMBER:
            case DecoratorTypes.NUMBER_SLIDER:
                const entityNumber: number = entity[key] as number;
                const numberMetadata: DefaultNumberDecoratorConfigInternal = metadata as DefaultNumberDecoratorConfigInternal;
                return this.getNumberValidationError(entityNumber, numberMetadata);
            case DecoratorTypes.OBJECT:
                const entityObject: EntityType = entity[key] as EntityType;
                for (const parameterKey in entityObject) {
                    const value: unknown = entityObject[parameterKey];
                    if (
                        !(metadata as DefaultObjectDecoratorConfigInternal<EntityType>).omit.includes(parameterKey)
                        && !(!metadata.required(entity) && (value == null || value == ''))
                    ) {
                        const err: ValidationError | undefined = this.getPropertyValidationError(entityObject, parameterKey, omit);
                        if (err) {
                            return {
                                property: metadata.displayName,
                                message: `${err.property} is invalid: ${err.message}`
                            };
                        }
                    }
                }
                break;
            case DecoratorTypes.ARRAY_STRING_CHIPS:
            case DecoratorTypes.ARRAY_STRING_AUTOCOMPLETE_CHIPS:
            case DecoratorTypes.ARRAY_DATE:
            case DecoratorTypes.ARRAY_DATE_TIME:
            case DecoratorTypes.ARRAY_DATE_RANGE:
            case DecoratorTypes.ARRAY:
                const entityArray: unknown[] = entity[key] as unknown[];
                // eslint-disable-next-line max-len
                const arrayMetadata: EntityArrayDecoratorConfigInternal<EntityType> = metadata as EntityArrayDecoratorConfigInternal<EntityType>;
                if (arrayMetadata.required(entity) && !entityArray.length) {
                    return {
                        property: metadata.displayName,
                        message: 'no items in array'
                    };
                }
                break;
            case DecoratorTypes.DATE:
                const entityDate: Date = new Date(entity[key] as Date);
                const dateMetadata: DefaultDateDecoratorConfigInternal = metadata as DefaultDateDecoratorConfigInternal;
                return this.getDateValidationError(entityDate, dateMetadata);
            case DecoratorTypes.DATE_RANGE:
                const entityDateRange: DateRange = LodashUtilities.cloneDeep(entity[key] as DateRange);
                const dateRangeMetadata: DateRangeDateDecoratorConfigInternal = metadata as DateRangeDateDecoratorConfigInternal;
                return this.getDateRangeValidationError(entity, entityDateRange, dateRangeMetadata);
            case DecoratorTypes.DATE_TIME:
                const entityDateTime: Date = new Date(entity[key] as Date);
                const dateTimeMetadata: DateTimeDateDecoratorConfigInternal = metadata as DateTimeDateDecoratorConfigInternal;
                const hasTime: boolean = ReflectUtilities.hasMetadata(EntityUtilities.TIME_KEY, entity, key);
                return this.getDateTimeValidationError(entityDateTime, dateTimeMetadata, hasTime);
            case DecoratorTypes.FILE_DEFAULT:
            case DecoratorTypes.FILE_IMAGE:
                const entityFile: FileData | FileData[] = entity[key] as FileData | FileData[];
                const entityFileMetadata: DefaultFileDecoratorConfigInternal = metadata as DefaultFileDecoratorConfigInternal;
                return this.getFileDataValidationError(entityFile, entityFileMetadata);
            case DecoratorTypes.REFERENCES_MANY:
            case DecoratorTypes.REFERENCES_ONE:
            case DecoratorTypes.HAS_MANY:
                break;
            case DecoratorTypes.CUSTOM:
                // eslint-disable-next-line typescript/no-explicit-any, max-len
                const customMetadata: CustomDecoratorConfigInternal<EntityType, any, any, any> = metadata as CustomDecoratorConfigInternal<EntityType, any, any, any>;
                if (!customMetadata.isValid(entity[key], omit)) {
                    return {
                        property: metadata.displayName,
                        message: 'invalid'
                    };
                }
                break;
            default:
                throw new Error(`Could not validate the input because the DecoratorType ${type} is not known`);
        }
        return undefined;
    }

    private static getBooleanValidationError<EntityType extends BaseEntityType<EntityType>>(
        entity: EntityType,
        value: boolean,
        metadata: ToggleBooleanDecoratorConfigInternal
    ): ValidationError | undefined {
        if (metadata.required(entity) && !value) {
            return {
                property: metadata.displayName,
                message: 'not selected'
            };
        }
        return undefined;
    }

    private static getStringValidationError(value: string, metadata: DefaultStringDecoratorConfigInternal): ValidationError | undefined {
        if (metadata.maxLength && value.length > metadata.maxLength) {
            return {
                property: metadata.displayName,
                message: `needs to be smaller than ${metadata.maxLength} characters`
            };
        }
        if (metadata.minLength && value.length < metadata.minLength) {
            return {
                property: metadata.displayName,
                message: `needs to be bigger than ${metadata.minLength} characters`
            };
        }
        if (metadata.regex && !value.match(metadata.regex)) {
            return {
                property: metadata.displayName,
                message: 'invalid'
            };
        }
        return undefined;
    }

    private static getTextboxValidationError(value: string, metadata: TextboxStringDecoratorConfigInternal): ValidationError | undefined {
        if (metadata.maxLength && value.length > metadata.maxLength) {
            return {
                property: metadata.displayName,
                message: `needs to be smaller than ${metadata.maxLength} characters`
            };
        }
        if (metadata.minLength && value.length < metadata.minLength) {
            return {
                property: metadata.displayName,
                message: `needs to be bigger than ${metadata.minLength} characters`
            };
        }
        return undefined;
    }

    private static getPasswordValidationError(
        value: string,
        metadata: PasswordStringDecoratorConfigInternal,
        confirmPassword: string
    ): ValidationError | undefined {
        if (value !== confirmPassword) {
            return {
                property: metadata.displayName,
                message: 'passwords need to match'
            };
        }
        if (metadata.maxLength && value.length > metadata.maxLength) {
            return {
                property: metadata.displayName,
                message: `needs to be smaller than ${metadata.maxLength} characters`
            };
        }
        if (metadata.minLength && value.length < metadata.minLength) {
            return {
                property: metadata.displayName,
                message: `needs to be bigger than ${metadata.minLength} characters`
            };
        }
        if (metadata.regex && !value.match(metadata.regex)) {
            return {
                property: metadata.displayName,
                message: 'invalid'
            };
        }
        return undefined;
    }

    private static getNumberValidationError(value: number, metadata: DefaultNumberDecoratorConfigInternal): ValidationError | undefined {
        if (metadata.max && value > metadata.max) {
            return {
                property: metadata.displayName,
                message: `needs to be smaller than ${metadata.max}`
            };
        }
        if (metadata.min && value < metadata.min) {
            return {
                property: metadata.displayName,
                message: `needs to be bigger than ${metadata.min}`
            };
        }
        return undefined;
    }

    private static getDateValidationError(value: Date, metadata: DefaultDateDecoratorConfigInternal): ValidationError | undefined {
        if (metadata.min && value.getTime() < metadata.min(value).getTime()) {
            return {
                property: metadata.displayName,
                message: `needs to be after ${formatDate(metadata.min(value))}`
            };
        }
        if (metadata.max && value.getTime() > metadata.max(value).getTime()) {
            return {
                property: metadata.displayName,
                message: `needs to be before ${formatDate(metadata.max(value))}`
            };
        }
        if (metadata.filter && !metadata.filter(value)) {
            return {
                property: metadata.displayName,
                message: 'invalid'
            };
        }
        return undefined;
    }

    private static getDateRangeValidationError<EntityType extends BaseEntityType<EntityType>>(
        entity: EntityType,
        value: Partial<DateRange>,
        metadata: DateRangeDateDecoratorConfigInternal
    ): ValidationError | undefined {
        if (metadata.required(entity)) {
            if (value.start == null || value.end == null || value.values == null) {
                return {
                    property: metadata.displayName,
                    message: 'required'
                };
            }
        }
        if (value.start) {
            value.start = new Date(value.start);
            if (metadata.minStart && value.start.getTime() < metadata.minStart(value.start).getTime()) {
                return {
                    property: metadata.displayName,
                    message: `start date needs to be after ${formatDate(metadata.minStart(value.start))}`
                };
            }
            if (metadata.maxStart && value.start.getTime() > metadata.maxStart(value.start).getTime()) {
                return {
                    property: metadata.displayName,
                    message: `start date needs to be before ${formatDate(metadata.maxStart(value.start))}`
                };
            }
            if (metadata.filter) {
                if (!metadata.filter(value.start)) {
                    return {
                        property: metadata.displayName,
                        message: 'start date invalid'
                    };
                }
            }
        }

        if (value.end) {
            value.end = new Date(value.end);
            if (metadata.minEnd && value.end.getTime() < metadata.minEnd(value.end).getTime()) {
                return {
                    property: metadata.displayName,
                    message: `end date needs to be after ${formatDate(metadata.minEnd(value.end))}`
                };
            }
            if (metadata.maxEnd && value.end.getTime() > metadata.maxEnd(value.end).getTime()) {
                return {
                    property: metadata.displayName,
                    message: `end date needs to be before ${formatDate(metadata.maxEnd(value.end))}`
                };
            }
            if (metadata.filter) {
                if (!metadata.filter(value.end)) {
                    return {
                        property: metadata.displayName,
                        message: 'end date invalid'
                    };
                }
            }
        }


        if (metadata.filter && value.values) {
            for (const date of value.values) {
                if (!metadata.filter(date)) {
                    return {
                        property: metadata.displayName,
                        message: `value ${formatDate(date)} invalid`
                    };
                }
            }
        }
        return undefined;
    }

    private static getDateTimeValidationError(
        value: Date,
        metadata: DateTimeDateDecoratorConfigInternal,
        hasTime: boolean
    ): ValidationError | undefined {
        if (!hasTime) {
            return {
                property: metadata.displayName,
                message: 'no time'
            };
        }
        if (metadata.minDate && value.getTime() < metadata.minDate(value).getTime()) {
            return {
                property: metadata.displayName,
                message: `date needs to be after ${formatDate(metadata.minDate(value))}`
            };
        }
        if (metadata.maxDate && value.getTime() > metadata.maxDate(value).getTime()) {
            return {
                property: metadata.displayName,
                message: `date needs to be before ${formatDate(metadata.maxDate(value))}`
            };
        }
        if (metadata.filterDate && !metadata.filterDate(value)) {
            return {
                property: metadata.displayName,
                message: 'invalid date'
            };
        }
        const time: Time = DateUtilities.getTimeFromDate(value) as Time;
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
                return {
                    property: metadata.displayName,
                    message: `time needs to be after ${minTime.hours}:${minTime.minutes}`
                };
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
                return {
                    property: metadata.displayName,
                    message: `time needs to be before ${maxTime.hours}:${maxTime.minutes}`
                };
            }
        }
        if (metadata.filterTime && !metadata.filterTime(time)) {
            return {
                property: metadata.displayName,
                message: 'invalid time'
            };
        }
        return undefined;
    }

    private static getFileDataValidationError(
        value: FileData | FileData[],
        metadata: DefaultFileDecoratorConfigInternal
    ): ValidationError | undefined {
        const files: FileData[] = metadata.multiple ? value as FileData[] : [value as FileData];
        let fileSizeTotal: number = 0;
        for (const file of files) {
            if (!file.name || !file.file && !file.url) {
                return {
                    property: metadata.displayName,
                    message: 'invalid'
                };
            }
            if (!FileUtilities.isMimeTypeValid(file.type, metadata.allowedMimeTypes)) {
                return {
                    property: metadata.displayName,
                    message: `mimetype needs to be one of ${metadata.allowedMimeTypes}`
                };
            }
            if (FileUtilities.transformToMegaBytes(file.size, 'B') > metadata.maxSize) {
                return {
                    property: metadata.displayName,
                    message: `file needs to be smaller than ${metadata.maxSize} MB`
                };
            }
            fileSizeTotal += file.size;
            if (FileUtilities.transformToMegaBytes(fileSizeTotal, 'B') > metadata.maxSizeTotal) {
                return {
                    property: metadata.displayName,
                    message: `The size of all files combined needs to be smaller than ${metadata.maxSizeTotal}`
                };
            }
        }
        return undefined;
    }
}

// eslint-disable-next-line jsdoc/require-jsdoc
function padTo2Digits(num: number): string {
    return num.toString().padStart(2, '0');
}

// eslint-disable-next-line jsdoc/require-jsdoc
function formatDate(date: Date): string {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear()
    ].join('/');
}