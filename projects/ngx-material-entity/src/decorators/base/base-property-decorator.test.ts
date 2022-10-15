import { EntityUtilities } from '../../classes/entity.utilities';
import { string } from '../string/string.decorator';
import { Entity } from '../../classes/entity.model';
import { TestEntityWithoutCustomPropertiesMockBuilder } from '../../mocks/test-entity.interface';
import { DecoratorTypes } from './decorator-types.enum';
import { expect } from '@jest/globals';
import { DefaultStringDecoratorConfigInternal } from '../string/string-decorator-internal.data';

describe('baseProperty', () => {
    test('id should have base Metadata', () => {
        // eslint-disable-next-line max-len
        const metadata: DefaultStringDecoratorConfigInternal = EntityUtilities.getPropertyMetadata(new TestEntityWithoutCustomPropertiesMockBuilder().testEntity, 'id', DecoratorTypes.STRING);
        expect(metadata).toBeDefined();
        expect(metadata.display).toBe(false);
        expect(metadata.displayName).toBe('ID');
        expect(metadata.omitForCreate).toBe(true);
        expect(metadata.omitForUpdate).toBe(true);
        expect(metadata.required).toBe(true);
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

    test('should throw error for incorrect tab metadata', () => {
        expect(
            () => {
                class BasePropertyTestEntity extends Entity {
                    @string({
                        displayStyle: 'line',
                        displayName: 'Wrong Row Value',
                        position: {
                            tab: 1
                        }
                    })
                    wrongTabValue!: string;

                    constructor(entity?: BasePropertyTestEntity) {
                        super();
                        EntityUtilities.new(this, entity);
                    }
                }
                new BasePropertyTestEntity({
                    id: '1',
                    wrongTabValue: '42'
                });
            }
        ).toThrow('tab must be at least 2');
    });
});