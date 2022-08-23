import { expect } from '@jest/globals';
import { LodashUtilities } from '../../capsulation/lodash.utilities';
import { EntityUtilities } from '../../classes/entity.utilities';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { custom } from './custom.decorator';

export class RandomInputTestEntity {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    @custom<string, RandomMetadata, RandomInputTestEntity>({
        customMetadata: {
            random: () => (Math.random() + 1).toString(36).substring(7)
        },
        displayName: 'Random Value',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        component: '' as any
    })
    randomValue!: string;

    constructor(data: RandomInputTestEntity) {
        EntityUtilities.new(this, data);
    }
}

interface RandomMetadata {
    random: () => string
}

const randomTe = new RandomInputTestEntity({ randomValue: '42' });

test('should have custom Metadata', () => {
    const metadata = EntityUtilities.getPropertyMetadata(randomTe, 'randomValue', DecoratorTypes.CUSTOM);
    expect(JSON.stringify(metadata.customMetadata)).toEqual(JSON.stringify({
        random: () => (Math.random() + 1).toString(36).substring(7)
    }));
    expect(JSON.stringify(metadata.isValid)).toEqual(JSON.stringify((() => true)));
    expect(JSON.stringify(metadata.isEqual)).toEqual(JSON.stringify(defaultIsEqual));

    expect(metadata.isValid(randomTe, 'create')).toBe(true);
    expect(metadata.isEqual(randomTe, randomTe, metadata)).toBe(true);
});

function defaultIsEqual<ValueType>(value: ValueType, valuePriorChanges: ValueType): boolean {
    return LodashUtilities.isEqual(value, valuePriorChanges);
}