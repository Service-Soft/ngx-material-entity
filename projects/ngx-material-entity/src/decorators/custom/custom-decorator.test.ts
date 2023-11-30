import { expect } from '@jest/globals';
import { LodashUtilities } from '../../encapsulation/lodash.utilities';
import { defaultTrue } from '../../functions/default-true.function';
import { EntityUtilities } from '../../utilities/entity.utilities';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { CustomDecoratorConfigInternal } from './custom-decorator-internal.data';
import { custom } from './custom.decorator';

export class RandomInputTestEntity {
    @custom<string, RandomMetadata, RandomInputTestEntity>({
        customMetadata: {
            random: () => (Math.random() + 1).toString(36).substring(7)
        },
        displayName: 'Random Value',
        // eslint-disable-next-line typescript/no-unsafe-assignment, typescript/no-explicit-any
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

const randomTe: RandomInputTestEntity = new RandomInputTestEntity({ randomValue: '42' });

test('should have custom Metadata', () => {
    // eslint-disable-next-line typescript/no-explicit-any
    const metadata: CustomDecoratorConfigInternal<any, unknown, Record<string, unknown>, any> | undefined
        = EntityUtilities.getPropertyMetadata(randomTe, 'randomValue', DecoratorTypes.CUSTOM);
    expect(JSON.stringify(metadata?.customMetadata)).toEqual(JSON.stringify({
        random: () => (Math.random() + 1).toString(36).substring(7)
    }));
    expect(JSON.stringify(metadata?.isValid)).toEqual(JSON.stringify(defaultTrue));
    expect(JSON.stringify(metadata?.isEqual)).toEqual(JSON.stringify(defaultIsEqual));

    expect(metadata?.isValid(randomTe, 'create')).toBe(true);
    expect(metadata?.isEqual(randomTe, randomTe, metadata)).toBe(true);
});

function defaultIsEqual<ValueType>(value: ValueType, valuePriorChanges: ValueType): boolean {
    return LodashUtilities.isEqual(value, valuePriorChanges);
}