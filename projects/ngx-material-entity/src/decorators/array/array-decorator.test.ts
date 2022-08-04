import { array } from './array.decorator';
import { expect } from '@jest/globals';
import { Entity } from '../../classes/entity.model';
import { EntityUtilities } from '../../classes/entity.utilities';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { TestEntity, TestEntityMockBuilder } from '../../mocks/test-entity.mock';

const testEntity: TestEntity = new TestEntityMockBuilder().testEntity;

test('should have array Metadata', () => {
    const metadata = EntityUtilities.getPropertyMetadata(testEntity, 'entityArrayValue', DecoratorTypes.ARRAY);
    expect(metadata).toBeDefined();
    expect(metadata.EntityClass).toBeDefined();
    expect(metadata.displayStyle).toEqual('table');
    expect(metadata.itemType).toEqual(DecoratorTypes.OBJECT);
    expect(metadata.displayColumns).toBeDefined();
    expect(metadata.createInline).toEqual(true);
    expect(metadata.missingErrorMessage).toEqual('Needs to contain at least one value');

    const customMetadata = EntityUtilities.getPropertyMetadata(testEntity, 'entityArrayValueWithConfig', DecoratorTypes.ARRAY);
    expect(customMetadata).toBeDefined();
    expect(customMetadata.missingErrorMessage).toEqual('custom missing error message');
    expect(customMetadata.createInline).toEqual(false);
});
test('should have metadata on array items', () => {
    const idMetadata1 = EntityUtilities.getPropertyMetadata(testEntity.entityArrayValue[0], 'id', DecoratorTypes.STRING);
    const stringMetadata1 = EntityUtilities.getPropertyMetadata(testEntity.entityArrayValue[0], 'stringValue', DecoratorTypes.STRING);

    const idMetadata2 = EntityUtilities.getPropertyMetadata(testEntity.entityArrayValue[1], 'id', DecoratorTypes.STRING);
    const stringMetadata2 = EntityUtilities.getPropertyMetadata(testEntity.entityArrayValue[1], 'stringValue', DecoratorTypes.STRING);

    expect(idMetadata1).toBeDefined();
    expect(stringMetadata1).toBeDefined();
    expect(idMetadata2).toBeDefined();
    expect(stringMetadata2).toBeDefined();
});
test('should throw error for invalid itemType metadata', () => {
    expect(
        () => {
            class ArrayTestEntity extends Entity {
                @array({
                    displayStyle: 'chips',
                    displayName: 'Wrong itemType Array Value',
                    itemType: 'invalidValue' as DecoratorTypes.STRING
                })
                wrongItemTypeArrayValue!: string[];
                constructor(entity?: ArrayTestEntity) {
                    super();
                    EntityUtilities.new(this, entity);
                }
            }
            new ArrayTestEntity({
                id: '1',
                wrongItemTypeArrayValue: ['42']
            });
        }
    ).toThrow('Unknown itemType invalidValue');
});