import { expect } from '@jest/globals';
import { BaseBuilder } from './base.builder';

interface Data {
    x: string,
    y?: string
}
class DataInternal implements Data {
    x: string;
    y: string;

    constructor(x: string, y: string) {
        this.x = x;
        this.y = y;
    }
}

class MockBuilder extends BaseBuilder<DataInternal, Data> {

    constructor(data: Data) {
        super(data);
    }

    protected generateBaseData(data: Data): DataInternal {
        return new DataInternal(data.x, data.y ? data.y : 'default y');
    }
}

test('Should create the internal data from the input data', () => {
    expect(new MockBuilder({x: '42', y: '43'}).getResult()).toEqual({ x: '42', y: '43' });
    expect(new MockBuilder({x: '42'}).getResult()).toEqual({ x: '42', y: 'default y' });
    expect(new MockBuilder({x: '42'}).withDefault('y', 'different default y').getResult()).toEqual({ x: '42', y: 'different default y' });
    expect(new MockBuilder({x: '42', y: '43'}).withDefault('y', 'different default y').getResult()).toEqual({ x: '42', y: '43' });
});