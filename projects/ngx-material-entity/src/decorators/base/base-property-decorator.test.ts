import { EntityUtilities } from '../../classes/entity-utilities.class';
import { string } from '../string/string.decorator';
import { Entity } from '../../classes/entity-model.class';
import { TestEntityMockBuilder } from '../../mocks/test-entity.mock';
import { DecoratorTypes } from './decorator-types.enum';
import { expect } from '@jest/globals';

describe('baseProperty', () => {
    test('id should have base Metadata', () => {
        const metdata = EntityUtilities.getPropertyMetadata(new TestEntityMockBuilder().testEntity, 'id', DecoratorTypes.STRING);
        expect(metdata).toBeDefined();
        expect(metdata.display).toBe(false);
        expect(metdata.displayName).toBe('ID');
        expect(metdata.omitForCreate).toBe(true);
        expect(metdata.omitForUpdate).toBe(true);
        expect(metdata.required).toBe(true);
    });
    test('should throw error for incorrect order metadata', () => {
        expect(
            () => {
                class BasePropertyTestEntity extends Entity {
                    @string({
                        displayStyle: 'line',
                        displayName: 'Wrong Order Value',
                        order: -1
                    })
                    wrongOrderValue!: string;

                    constructor(entity?: BasePropertyTestEntity) {
                        super();
                        EntityUtilities.new(this, entity);
                    }
                }
                new BasePropertyTestEntity({
                    id: '1',
                    wrongOrderValue: '42'
                });
            }
        ).toThrow('order must be at least 0');
    });
});