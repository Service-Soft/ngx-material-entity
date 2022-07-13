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
                        position: {
                            order: -1
                        }
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
        ).toThrow('order must be at least 1');
        expect(
            () => {
                class BasePropertyTestEntity extends Entity {
                    @string({
                        displayStyle: 'line',
                        displayName: 'Wrong Order Value',
                        position: {
                            order: 13
                        }
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
        ).toThrow('order cannot be bigger than 12 (the minimum value for a bootstrap column)');
    });

    test('should throw error for incorrect row metadata', () => {
        expect(
            () => {
                class BasePropertyTestEntity extends Entity {
                    @string({
                        displayStyle: 'line',
                        displayName: 'Wrong Row Value',
                        position: {
                            row: -1
                        }
                    })
                    wrongRowValue!: string;

                    constructor(entity?: BasePropertyTestEntity) {
                        super();
                        EntityUtilities.new(this, entity);
                    }
                }
                new BasePropertyTestEntity({
                    id: '1',
                    wrongRowValue: '42'
                });
            }
        ).toThrow('row must be at least 1');
    });
});