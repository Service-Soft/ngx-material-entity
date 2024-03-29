import { HttpClient } from '@angular/common/http';
import { expect } from '@jest/globals';
import 'zone.js';
import { Entity } from '../classes/entity.model';
import { DecoratorTypes } from '../decorators/base/decorator-types.enum';
import { string } from '../decorators/string/string.decorator';
import { LodashUtilities } from '../encapsulation/lodash.utilities';
import { ReflectUtilities } from '../encapsulation/reflect.utilities';
import { mockInjector } from '../mocks/environment-injector.mock';
import { HttpClientMock } from '../mocks/http-client.mock';
import { TestEntityWithoutCustomProperties, TestEntityWithoutCustomPropertiesMockBuilder, TestObjectArrayEntity, TestObjectEntity, getDatesBetween } from '../mocks/test-entity.interface';
import { EntityTab, EntityUtilities } from './entity.utilities';

const builder: TestEntityWithoutCustomPropertiesMockBuilder = new TestEntityWithoutCustomPropertiesMockBuilder();
const testEntity: TestEntityWithoutCustomProperties = builder.testEntity;
const testEntityWithoutData: TestEntityWithoutCustomProperties = builder.testEntityWithoutData;
// const testEntityWithoutMetadata: TestEntityWithoutCustomProperties = builder.testEntityData;
const http: HttpClient = new HttpClientMock([]) as unknown as HttpClient;

/**
 * Checks whether or not a given value is an Entity.
 * @param value - The value to check.
 * @returns Whether or not the given value is an Entity.
 */
function valueIsEntity(value: unknown): value is Entity {
    if (value != null && typeof value === 'object') {
        return ReflectUtilities.has(value, 'id' as keyof typeof value);
    }
    else {
        return false;
    }
}

describe('new', () => {
    test('should define all values for testEntity', async () => {
        for (const key in testEntity) {
            const value: unknown = ReflectUtilities.get(testEntity, key as keyof TestEntityWithoutCustomProperties);
            expect(value).toBeDefined();
            if (key == ('optionalObjectValue' as keyof TestEntityWithoutCustomProperties)) {
                if (valueIsEntity(value)) {
                    for (const k in value) {
                        if (k == ('rowValue1' as keyof TestEntityWithoutCustomProperties)) {
                            expect(ReflectUtilities.get(value, k as keyof Entity)).toBe('');
                        }
                        else {
                            expect(ReflectUtilities.get(value, k as keyof Entity)).toBeUndefined();
                        }
                    }
                }
            }
            else {
                if (valueIsEntity(value)) {
                    for (const k in value) {
                        expect(ReflectUtilities.get(value, k as keyof Entity)).toBeDefined();
                    }
                }
            }
        }
    });
    test('should not define any values for testEntityWithoutData', () => {
        for (const key in testEntityWithoutData) {
            const value: unknown = ReflectUtilities.get(testEntityWithoutData, key as keyof Entity);
            if (valueIsEntity(value)) {
                for (const k in value) {
                    expect(ReflectUtilities.get(value, k as keyof Entity)).toBeUndefined();
                }
            }
            else if (LodashUtilities.isArray(value)) {
                expect(ReflectUtilities.get(testEntityWithoutData, key as keyof Entity)).toEqual([]);
            }
            else {
                expect(ReflectUtilities.get(testEntityWithoutData, key as keyof Entity)).toBeUndefined();
            }
        }
    });
});

describe('getOmitForCreate', () => {
    test('should get correct omitForCreate values from metadata', async () => {
        expect(EntityUtilities.getOmitForCreate(testEntity)).toEqual(['id', 'omitForCreateValue', 'customFileValues', 'notDecoratedValue']);
        expect(EntityUtilities.getOmitForCreate(testEntityWithoutData)).toEqual(['id', 'omitForCreateValue', 'customFileValues', 'notDecoratedValue']);
    });
});

describe('getFileProperties', () => {
    test('should get all file property keys from the entity', async () => {
        expect(EntityUtilities.getFileProperties(testEntity)).toEqual([
            'fileValue',
            'dragDropFileValue',
            'customFileValues',
            'imageValue',
            'imageDragDropValue',
            'customImageValues'
        ]);
        expect(EntityUtilities.getFileProperties(testEntityWithoutData)).toEqual([
            'fileValue',
            'dragDropFileValue',
            'customFileValues',
            'imageValue',
            'imageDragDropValue',
            'customImageValues'
        ]);
    });
});

describe('getOmitForUpdate', () => {
    test('should get correct omitForUpdate values from metadata', async () => {
        expect(EntityUtilities.getOmitForUpdate(testEntity)).toEqual(['id', 'omitForUpdateValue', 'customFileValues', 'notDecoratedValue']);
        expect(EntityUtilities.getOmitForUpdate(testEntityWithoutData)).toEqual(['id', 'omitForUpdateValue', 'customFileValues', 'notDecoratedValue']);
    });
});

describe('getWithoutOmitUpdateValues', () => {
    test('should get correct update request body', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        const tEPriorChanges: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        tE.entityArrayValue.push(new TestObjectArrayEntity({
            stringValue: 'stringValue',
            secondTabValue: 'secondTabValue',
            id: 'id'
        }));
        tE.objectValue = new TestObjectEntity({
            maxLengthStringValue: 'test',
            secondTabStringValue: 'test',
            rowValue1: 'test',
            rowValue2: 'test',
            id: 'id'
        });
        const res: Partial<TestEntityWithoutCustomProperties> = await EntityUtilities.getWithoutOmitUpdateValues(
            tE,
            tEPriorChanges,
            http,
            mockInjector
        );
        expect(res).toEqual({
            objectValue: {
                maxLengthStringValue: 'test',
                rowValue1: 'test',
                rowValue2: 'test',
                secondTabStringValue: 'test'
            },
            entityArrayValue: [
                {
                    secondTabValue: 'stv 1',
                    stringValue: 'stringValue'
                },
                {
                    secondTabValue: 'stv 2',
                    stringValue: 'stringValue2' },
                {
                    secondTabValue: 'secondTabValue',
                    stringValue: 'stringValue'
                }
            ] });
    });
});

describe('getPropertyMetadata', () => {
    test('should get metadata', () => {
        expect(EntityUtilities.getPropertyMetadata(testEntity, 'omitForCreateValue', DecoratorTypes.STRING)).toBeDefined();
        expect(EntityUtilities.getPropertyMetadata(testEntityWithoutData, 'omitForCreateValue', DecoratorTypes.STRING)).toBeDefined();
    });
    test('should return undefined for parameter without metadata', () => {
        expect(EntityUtilities.getPropertyMetadata(testEntity, 'notDecoratedValue')).toBe(undefined);
    });
});

describe('getPropertyType', () => {
    test('should return correct type', () => {
        expect(EntityUtilities.getPropertyType(testEntity, 'omitForCreateValue')).toBe(DecoratorTypes.STRING);
    });
    test('should return undefined for parameter without metadata', () => {
        expect(EntityUtilities.getPropertyType(testEntity, 'notDecoratedValue')).toBe(undefined);
    });
});

describe('dirty', () => {
    test('should be able to tell if an entity was modified', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        const tEPriorChanges: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(tE);
        expect(await EntityUtilities.isDirty(tE, tEPriorChanges, http)).toBe(false);
        tE.minNumberValue = 1234;
        expect(await EntityUtilities.isDirty(tE, tEPriorChanges, http)).toBe(true);
        expect(await EntityUtilities.isDirty(tE, undefined as never, http)).toBe(false);
    });
    test('should tell if date range array is dirty', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        const tEPriorChanges: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(tE);
        expect(await EntityUtilities.isDirty(tE, tEPriorChanges, http)).toBe(false);

        tE.dateRangeArrayValue[0].start = new Date();
        expect(await EntityUtilities.isDirty(tE, tEPriorChanges, http)).toBe(true);

        tE.dateRangeArrayValue[0].start = testEntity.dateRangeArrayValue[0].start;
        expect(await EntityUtilities.isDirty(tE, tEPriorChanges, http)).toBe(false);

        tE.dateRangeArrayValue.push({ start: new Date(), end: new Date(), values: getDatesBetween(new Date(), new Date()) });
        expect(await EntityUtilities.isDirty(tE, tEPriorChanges, http)).toBe(true);

        tE.dateRangeArrayValue = testEntity.dateRangeArrayValue;
        expect(await EntityUtilities.isDirty(tE, tEPriorChanges, http)).toBe(false);
    });
    test('should tell if custom value is dirty', async () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        const tEPriorChanges: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        tE.randomValue = '12345';
        expect(await EntityUtilities.isDirty(tE, tEPriorChanges, http)).toBe(true);
        tE.randomValue = '42';
        expect(await EntityUtilities.isDirty(tE, tEPriorChanges, http)).toBe(false);
    });
});

describe('compareOrder', () => {
    test('should sort entity properties by their order value', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        let keys: (keyof TestEntityWithoutCustomProperties)[] = EntityUtilities.keysOf(tE, mockInjector);
        expect(keys[0]).not.toBe('orderValue1');
        keys = keys.sort((a, b) => EntityUtilities.compareOrder(a, b, tE));
        expect(keys[0]).toBe('orderValue1');
        expect(keys[1]).toBe('orderValue2');
        expect(keys[2]).toBe('orderValue3');
    });
    test('should be equal if a not decorated value is passed', () => {
        expect(EntityUtilities.compareOrder('notDecoratedValue', 'booleanCheckboxValue', testEntity)).toBe(0);
    });
});

describe('getWidth', () => {
    test('should get the default width', () => {
        expect(EntityUtilities.getWidthClasses(testEntity, 'maxLengthStringValue')).toBe('col-lg-6 col-md-6 col-sm-12');
        const EXPECTED_EM: string = 'Could not get metadata for property "notDecoratedValue"';
        expect(() => EntityUtilities.getWidthClasses(testEntity, 'notDecoratedValue')).toThrow(EXPECTED_EM);
    });
});

describe('resetChangesOnEntity', () => {
    test('should reset entity', async () => {
        const tE: TestEntityWithoutCustomProperties = new TestEntityWithoutCustomProperties(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        const tEPriorChanges: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(tE);
        tE.minLengthStringValue = 'changed value';
        expect(await EntityUtilities.isDirty(tE, tEPriorChanges, http)).toBe(true);
        EntityUtilities.resetChangesOnEntity(tE, tEPriorChanges);
        expect(await EntityUtilities.isDirty(tE, tEPriorChanges, http)).toBe(false);
    });
});

class DefaultValueEntity extends Entity {
    @string({
        displayName: 'Name',
        displayStyle: 'line',
        default: 'James'
    })
    name!: string;

    @string({
        displayName: 'Last Name',
        displayStyle: 'line',
        default: () => 'Smith'
    })
    lastName!: string;

    constructor(entity?: DefaultValueEntity) {
        super(entity);
        EntityUtilities.new(this, entity);
    }
}

describe('setDefaultValues', () => {
    test('should not set any default values', async () => {
        const tE: TestEntityWithoutCustomProperties = new TestEntityWithoutCustomProperties(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        const tEPriorChanges: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(tE);
        EntityUtilities.setDefaultValues(tE);
        expect(await EntityUtilities.isDirty(tE, tEPriorChanges, http)).toBe(false);
    });
    test('should set default values', async () => {
        const tE: DefaultValueEntity = new DefaultValueEntity();
        const tEPriorChanges: DefaultValueEntity = LodashUtilities.cloneDeep(tE);
        EntityUtilities.setDefaultValues(tE);
        expect(await EntityUtilities.isDirty(tE, tEPriorChanges, http)).toBe(true);
        expect(tE.name).toBe('James');
        expect(tE.lastName).toBe('Smith');
    });
});

describe('getEntityTabs', () => {
    test('should get two tabs for the entity', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        const tabs: EntityTab<TestEntityWithoutCustomProperties>[] = EntityUtilities.getEntityTabs(tE, mockInjector);
        expect(tabs).toHaveLength(2);
        expect(tabs[0].rows).toHaveLength(2);
        expect(tabs[0].tabName).toBe('Tab 1');
        expect(tabs[1].tabName).toBe('Tab 2');
    });
    test('should get custom tab names on object', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        const tabs: EntityTab<TestObjectEntity>[] = EntityUtilities.getEntityTabs(tE.objectValue, mockInjector);
        expect(tabs).toHaveLength(2);
        expect(tabs[0].tabName).toBe('Object First Tab Values');
        expect(tabs[1].tabName).toBe('Other properties');
    });
});

describe('keysOf', () => {
    test('should get all keys of the entity', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        expect(EntityUtilities.keysOf(tE, mockInjector)).toHaveLength(55);
    });
    test('should get keys without omitForCreate', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        const keysWithoutCreate: (keyof TestEntityWithoutCustomProperties)[] = EntityUtilities.keysOf(tE, mockInjector, true);
        expect(keysWithoutCreate.includes('omitForCreateValue')).toBe(false);
        expect(keysWithoutCreate.includes('omitForUpdateValue')).toBe(true);
    });
    test('should get keys without omitForUpdate', () => {
        const tE: TestEntityWithoutCustomProperties = LodashUtilities.cloneDeep(testEntity);
        TestEntityWithoutCustomPropertiesMockBuilder.setupMetadata(tE);
        const keysWithoutUpdate: (keyof TestEntityWithoutCustomProperties)[] = EntityUtilities.keysOf(tE, mockInjector, false, true);
        expect(keysWithoutUpdate.includes('omitForUpdateValue')).toBe(false);
        expect(keysWithoutUpdate.includes('omitForCreateValue')).toBe(true);
    });
});