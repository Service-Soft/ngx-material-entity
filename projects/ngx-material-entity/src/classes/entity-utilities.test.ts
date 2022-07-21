import { TestEntityMockBuilder, TestEntity } from '../mocks/test-entity.mock';
import { DecoratorTypes } from '../decorators/base/decorator-types.enum';
import { EntityUtilities } from './entity-utilities.class';
import { cloneDeep, isArray } from 'lodash';
import { Entity } from './entity-model.class';
import { expect } from '@jest/globals';

const builder = new TestEntityMockBuilder();
const testEntity: TestEntity = builder.testEntity;
const testEntityWithoutData: TestEntity = builder.testEntityWithoutData;
const testEntityWithoutMetadata: TestEntity = builder.testEntityData;


/**
 * Checks whether or not a given value is an Entity.
 *
 * @param value - The value to check.
 * @returns Whether or not the given value is an Entity.
 */
function valueIsEntity(value: unknown): value is Entity {
    if (value && typeof value === 'object') {
        return Reflect.has(value, 'id');
    }
    else {
        return false;
    }
}

describe('new', () => {
    test('should define all values for testEntity', async () => {
        for (const key in testEntity) {
            const value: unknown = Reflect.get(testEntity, key);
            expect(value).toBeDefined();
            if (valueIsEntity(value)) {
                for (const k in value) {
                    expect(Reflect.get(value, k)).toBeDefined();
                }
            }
        }
    });
    test('should not define any values for testEntityWithoutData', () => {
        for (const key in testEntityWithoutData) {
            const value: unknown = Reflect.get(testEntityWithoutData, key);
            if (valueIsEntity(value)) {
                for (const k in value) {
                    expect(Reflect.get(value, k)).toBeUndefined();
                }
            }
            else if (isArray(value)) {
                expect(Reflect.get(testEntityWithoutData, key)).toEqual([]);
            }
            else {
                expect(Reflect.get(testEntityWithoutData, key)).toBeUndefined();
            }
        }
    });
});

describe('getOmitForCreate', () => {
    test('should get correct omitForCreate values from metadata', async () => {
        expect(EntityUtilities.getOmitForCreate(testEntity)).toEqual(['id', 'omitForCreateValue']);
        expect(EntityUtilities.getOmitForCreate(testEntityWithoutData)).toEqual(['id', 'omitForCreateValue']);
    });
});

describe('getOmitForUpdate', () => {
    test('should get correct omitForUpdate values from metadata', async () => {
        expect(EntityUtilities.getOmitForUpdate(testEntity)).toEqual(['id', 'omitForUpdateValue']);
        expect(EntityUtilities.getOmitForUpdate(testEntityWithoutData)).toEqual(['id', 'omitForUpdateValue']);
    });
});

describe('getPropertyMetadata', () => {
    test('should get metadata', () => {
        expect(EntityUtilities.getPropertyMetadata(testEntity, 'omitForCreateValue', DecoratorTypes.STRING)).toBeDefined();
        expect(EntityUtilities.getPropertyMetadata(testEntityWithoutData, 'omitForCreateValue', DecoratorTypes.STRING)).toBeDefined();
    });
    test('should throw error for parameter without metadata', () => {
        // eslint-disable-next-line max-len
        const expectedEm: string = `Could not find metadata for property omitForCreateValue on the entity ${JSON.stringify(testEntityWithoutMetadata)}`;
        // eslint-disable-next-line max-len
        expect(() => EntityUtilities.getPropertyMetadata(testEntityWithoutMetadata, 'omitForCreateValue', DecoratorTypes.STRING)).toThrow(expectedEm);
    });
});

describe('getPropertyType', () => {
    test('should return correct type', () => {
        expect(EntityUtilities.getPropertyType(testEntity, 'omitForCreateValue')).toBe(DecoratorTypes.STRING);
    });
    test('should throw error for parameter without metadata', () => {
        // eslint-disable-next-line max-len
        const expectedEm: string = `Could not find type metadata for property omitForCreateValue on the entity ${JSON.stringify(testEntityWithoutMetadata)}`;
        expect(() => EntityUtilities.getPropertyType(testEntityWithoutMetadata, 'omitForCreateValue')).toThrow(expectedEm);
    });
});

describe('isEntityValid', () => {
    test('testEntity should be valid for create and update', () => {
        expect(EntityUtilities.isEntityValid(testEntity, 'create')).toBe(true);
        expect(EntityUtilities.isEntityValid(testEntity, 'update')).toBe(true);
    });
    test('testEntityWithoutData should be invalid for create and update', () => {
        expect(EntityUtilities.isEntityValid(testEntityWithoutData, 'create')).toBe(false);
        expect(EntityUtilities.isEntityValid(testEntityWithoutData, 'update')).toBe(false);
    });
    test('Optional value should not invalidate when set to undefined', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.optionalValue = undefined;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
        tE.optionalValue = 'optional';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // STRING
    test('STRING maxLength', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.maxLengthStringValue = '12345';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxLengthStringValue = 'ABCD';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING minLength', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.minLengthStringValue = '123';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minLengthStringValue = 'ABCDEFG';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING regex', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.regexStringValue = '12345s';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.regexStringValue = '54321';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // STRING_AUTOCOMPLETE
    test('STRING_AUTOCOMPLETE maxLength', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.maxLengthAutocompleteStringValue = '12345';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxLengthAutocompleteStringValue = 'ABCD';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_AUTOCOMPLETE minLength', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.minLengthAutocompleteStringValue = '123';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minLengthAutocompleteStringValue = 'ABCDEFG';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_AUTOCOMPLETE regex', () => {
        testEntity.regexAutocompleteStringValue = '12345s';
        expect(EntityUtilities.isEntityValid(testEntity, 'create')).toBe(false);
        testEntity.regexAutocompleteStringValue = '54321';
        expect(EntityUtilities.isEntityValid(testEntity, 'create')).toBe(true);
    });

    // STRING_TEXTBOX
    test('STRING_TEXTBOX maxLength', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.maxLengthTextboxStringValue = '12345';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxLengthTextboxStringValue = 'ABCD';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_TEXTBOX minLength', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.minLengthTextboxStringValue = '123';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minLengthTextboxStringValue = 'ABCDEFG';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // NUMBER
    test('NUMBER max', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.maxNumberValue = 11;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxNumberValue = 10;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('NUMBER min', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.minNumberValue = 9;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minNumberValue = 10;
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // OBJECT
    test('OBJECT', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.objectValue.maxLengthStringValue = '12345';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.objectValue.maxLengthStringValue = '1234';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // ARRAY
    test('ARRAY', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.stringChipsArrayValue = [];
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.stringChipsArrayValue = ['1234'];
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    test('should throw error for unknown metadata type', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        Reflect.defineMetadata('type', 'invalid type', tE, 'maxLengthStringValue');
        const expectedEm: string = 'Could not validate the input because the DecoratorType invalid type is not known';
        expect(() => EntityUtilities.isEntityValid(tE, 'create')).toThrow(expectedEm);
    });
});

describe('dirty', () => {
    test('should be able to tell if an entity was modified', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        const tEPriorChanges: TestEntity = cloneDeep(tE);
        expect(EntityUtilities.dirty(tE, tEPriorChanges)).toBe(false);
        tE.minNumberValue = 1234;
        expect(EntityUtilities.dirty(tE, tEPriorChanges)).toBe(true);
        expect(EntityUtilities.dirty(tE, undefined as never)).toBe(false);
    });
});

describe('compareOrder', () => {
    test('should sort entity properties by their order value', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        let keys: (keyof TestEntity)[] = EntityUtilities.keysOf(tE);
        expect(keys[0]).not.toBe('orderValue1');
        keys = keys.sort((a, b) => EntityUtilities.compareOrder(a, b, tE));
        expect(keys[0]).toBe('orderValue1');
        expect(keys[1]).toBe('orderValue2');
        expect(keys[2]).toBe('orderValue3');
    });
});

describe('getWidth', () => {
    test('should get the default width', () => {
        expect(EntityUtilities.getWidth(testEntity, 'maxLengthStringValue', 'lg')).toBe(6);
        expect(EntityUtilities.getWidth(testEntity, 'maxLengthStringValue', 'md')).toBe(6);
        expect(EntityUtilities.getWidth(testEntity, 'maxLengthStringValue', 'sm')).toBe(12);
    });
});

describe('resetChangesOnEntity', () => {
    test('should reset entity', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        const tEPriorChanges: TestEntity = cloneDeep(tE);
        tE.minLengthStringValue = 'changed value';
        expect(EntityUtilities.dirty(tE, tEPriorChanges)).toBe(true);
        EntityUtilities.resetChangesOnEntity(tE, tEPriorChanges);
        expect(EntityUtilities.dirty(tE, tEPriorChanges)).toBe(false);
    });
});

describe('getEntityRows', () => {
    test('should get only one row when nothing is defined', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        expect(EntityUtilities.getEntityRows(tE)).toHaveLength(2);
    });
});

describe('keysOf', () => {
    test('should get all keys of the entity', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        expect(EntityUtilities.keysOf(tE)).toHaveLength(30);
    });
    test('should get keys without omitForCreate', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        const keysWithoutCreate = EntityUtilities.keysOf(tE, true);
        expect(keysWithoutCreate.includes('omitForCreateValue')).toBe(false);
        expect(keysWithoutCreate.includes('omitForUpdateValue')).toBe(true);
    });
    test('should get keys without omitForUpdate', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        const keysWithoutUpdate = EntityUtilities.keysOf(tE, false, true);
        expect(keysWithoutUpdate.includes('omitForUpdateValue')).toBe(false);
        expect(keysWithoutUpdate.includes('omitForCreateValue')).toBe(true);
    });
});