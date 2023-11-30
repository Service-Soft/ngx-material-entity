import { expect } from '@jest/globals';
import { defaultDynamicStyleClasses } from './default-style-classes.function';

test('should return  []', () => {
    // eslint-disable-next-line typescript/no-explicit-any
    expect(defaultDynamicStyleClasses(undefined as any)).toEqual([]);
});