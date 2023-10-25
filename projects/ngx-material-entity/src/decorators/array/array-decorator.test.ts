import { expect } from '@jest/globals';
import { Entity } from '../../classes/entity.model';
import { defaultGlobalDefaults } from '../../default-global-configuration-values';
import { TestEntityWithoutCustomProperties, TestEntityWithoutCustomPropertiesMockBuilder } from '../../mocks/test-entity.interface';
import { EntityUtilities } from '../../utilities/entity.utilities';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { DefaultStringDecoratorConfigInternal } from '../string/string-decorator-internal.data';
import { EntityArrayDecoratorConfigInternal } from './array-decorator-internal.data';
import { array } from './array.decorator';

const testEntity: TestEntityWithoutCustomProperties = new TestEntityWithoutCustomPropertiesMockBuilder().testEntity;

test('should have array Metadata', () => {
    // eslint-disable-next-line typescript/no-explicit-any
    let metadata: EntityArrayDecoratorConfigInternal<any> = EntityUtilities.getPropertyMetadata(testEntity, 'entityArrayValue', DecoratorTypes.ARRAY);
    metadata = new EntityArrayDecoratorConfigInternal(metadata, defaultGlobalDefaults);
    expect(metadata).toBeDefined();
    expect(metadata.EntityClass).toBeDefined();
    expect(metadata.itemType).toEqual(DecoratorTypes.OBJECT);
    expect(metadata.displayColumns).toBeDefined();
    expect(metadata.createInline).toEqual(true);
    expect(metadata.missingErrorMessage).toEqual('Needs to contain at least one value');
    expect(metadata.editDialogData).toBeDefined();
    expect(metadata.editDialogData.title(testEntity)).toEqual('Edit');

    // eslint-disable-next-line typescript/no-explicit-any
    const customMetadata: EntityArrayDecoratorConfigInternal<any> = EntityUtilities.getPropertyMetadata(testEntity, 'entityArrayValueWithConfig', DecoratorTypes.ARRAY);
    expect(customMetadata).toBeDefined();
    expect(customMetadata.missingErrorMessage).toEqual('custom missing error message');
    expect(customMetadata.createInline).toEqual(false);
});
test('should have metadata on array items', () => {
    const idMetadata1: DefaultStringDecoratorConfigInternal = EntityUtilities.getPropertyMetadata(testEntity.entityArrayValue[0], 'id', DecoratorTypes.STRING);
    const stringMetadata1: DefaultStringDecoratorConfigInternal = EntityUtilities.getPropertyMetadata(testEntity.entityArrayValue[0], 'stringValue', DecoratorTypes.STRING);

    const idMetadata2: DefaultStringDecoratorConfigInternal = EntityUtilities.getPropertyMetadata(testEntity.entityArrayValue[1], 'id', DecoratorTypes.STRING);
    const stringMetadata2: DefaultStringDecoratorConfigInternal = EntityUtilities.getPropertyMetadata(testEntity.entityArrayValue[1], 'stringValue', DecoratorTypes.STRING);

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