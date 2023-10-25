import { expect } from '@jest/globals';
import { Entity } from '../../classes/entity.model';
import { defaultTrue } from '../../functions/default-true.function';
import { TestEntityWithoutCustomPropertiesMockBuilder } from '../../mocks/test-entity.interface';
import { EntityUtilities } from '../../utilities/entity.utilities';
import { DefaultStringDecoratorConfigInternal } from '../string/string-decorator-internal.data';
import { string } from '../string/string.decorator';
import { DecoratorTypes } from './decorator-types.enum';

describe('baseProperty', () => {
    test('id should have base Metadata', () => {
        const metadata: DefaultStringDecoratorConfigInternal = EntityUtilities.getPropertyMetadata(new TestEntityWithoutCustomPropertiesMockBuilder().testEntity, 'id', DecoratorTypes.STRING);
        expect(metadata).toBeDefined();
        expect(metadata.display(null)).toBe(false);
        expect(metadata.displayName).toBe('ID');
        expect(metadata.omitForCreate).toBe(true);
        expect(metadata.omitForUpdate).toBe(true);
        expect(metadata.required).toBe(defaultTrue);
        expect(metadata.change).toBe(undefined);
    });

    test('should throw error for incorrect order metadata', () => {
        expect(
            () => {
                class BasePropertyTestEntity extends Entity {
                    @string({
                        displayStyle: 'line',
                        displayName: 'Wrong Order Value',
                        position: {
                            order: 0
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
        ).toThrow('order cannot be bigger than 12 (the maximum value for a bootstrap column)');
    });

    test('should throw error for incorrect row metadata', () => {
        expect(
            () => {
                class BasePropertyTestEntity extends Entity {
                    @string({
                        displayStyle: 'line',
                        displayName: 'Wrong Row Value',
                        position: {
                            row: 0
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
                        displayName: 'Wrong Tab Value',
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
        ).toThrow('tab must be either -1 for the first tab or at least 2');
    });
});