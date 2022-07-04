import { TestEntityMockBuilder, TestEntity } from '../mocks/test-entity.mock';
import { DecoratorTypes } from '../decorators/base/decorator-types.enum';
import { EntityUtilities } from './entity-utilities.class';
import { cloneDeep } from 'lodash';
import { Entity } from './entity-model.class';

const builder = new TestEntityMockBuilder();
const testEntity: TestEntity = builder.testEntity;
const testEntityWithoutData: TestEntity = builder.testEntityWithoutData;
const testEntityWithoutMetadata: TestEntity = builder.testEntityData;

function valueIsEntity(entity: unknown): entity is Entity {
    if (entity && typeof entity === 'object') {
        return Reflect.has(entity, 'id');
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
        tE.maxLengthValue = '12345';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxLengthValue = 'ABCD';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING minLength', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.minLengthValue = '123';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minLengthValue = 'ABCDEFG';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING regex', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.regexValue = '12345s';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.regexValue = '54321';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });

    // STRING_AUTOCOMPLETE
    test('STRING_AUTOCOMPLETE maxLength', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.maxLengthAutocompleteValue = '12345';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxLengthAutocompleteValue = 'ABCD';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_AUTOCOMPLETE minLength', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.minLengthAutocompleteValue = '123';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minLengthAutocompleteValue = 'ABCDEFG';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_AUTOCOMPLETE regex', () => {
        testEntity.regexAutocompleteValue = '12345s';
        expect(EntityUtilities.isEntityValid(testEntity, 'create')).toBe(false);
        testEntity.regexAutocompleteValue = '54321';
        expect(EntityUtilities.isEntityValid(testEntity, 'create')).toBe(true);
    });

    // STRING_TEXTBOX
    test('STRING_TEXTBOX maxLength', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.maxLengthTextboxValue = '12345';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.maxLengthTextboxValue = 'ABCD';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(true);
    });
    test('STRING_TEXTBOX minLength', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        tE.minLengthTextboxValue = '123';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.minLengthTextboxValue = 'ABCDEFG';
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
        tE.objectValue.maxLengthValue = '12345';
        expect(EntityUtilities.isEntityValid(tE, 'create')).toBe(false);
        tE.objectValue.maxLengthValue = '1234';
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
        Reflect.defineMetadata('type', 'invalid type', tE, 'maxLengthValue');
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
        let keys: (keyof TestEntity)[] = (Reflect.ownKeys(tE) as (keyof TestEntity)[]);
        expect(keys[0]).not.toBe('orderValue1');
        keys = keys.sort((a, b) => EntityUtilities.compareOrder(a, b, tE));
        expect(keys[0]).toBe('orderValue1');
        expect(keys[1]).toBe('orderValue2');
        expect(keys[2]).toBe('orderValue3');
    });
});

describe('getWidth', () => {
    test('should get the default width', () => {
        expect(EntityUtilities.getWidth(testEntity, 'maxLengthValue', 'lg')).toBe(6);
        expect(EntityUtilities.getWidth(testEntity, 'maxLengthValue', 'md')).toBe(6);
        expect(EntityUtilities.getWidth(testEntity, 'maxLengthValue', 'sm')).toBe(12);
    });
    test('should throw error for unknown screen size', () => {
        const expectedEm: string = 'Something went wrong getting the width';
        expect(() => EntityUtilities.getWidth(testEntity, 'maxLengthValue', 'invalid' as 'lg' | 'md' | 'sm')).toThrow(expectedEm);
    });
    test('should throw error if no metadata was found', () => {
        const expectedEm: string = 'Something went wrong getting the width';
        expect(() => EntityUtilities.getWidth(testEntityWithoutMetadata, 'maxLengthValue', 'sm')).toThrow(expectedEm);
    })
});

describe('resetChangesOnEntity', () => {
    test('should reset entity', () => {
        const tE: TestEntity = cloneDeep(testEntity);
        const tEPriorChanges: TestEntity = cloneDeep(tE);
        tE.minLengthValue = 'changed value';
        expect(EntityUtilities.dirty(tE, tEPriorChanges)).toBe(true);
        EntityUtilities.resetChangesOnEntity(tE, tEPriorChanges);
        expect(EntityUtilities.dirty(tE, tEPriorChanges)).toBe(false);
    });
});