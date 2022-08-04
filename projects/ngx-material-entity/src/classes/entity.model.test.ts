import { Entity } from './entity.model';
import { EntityUtilities } from './entity.utilities';
import { string } from '../decorators/string/string.decorator';
import { expect } from '@jest/globals';

export class TestEntity extends Entity {
    @string({
        displayName: 'Name',
        displayStyle: 'line'
    })
    name!: string;

    constructor(entity?: TestEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}

class TestEntityConstruct extends Entity {
    @string({
        displayName: 'Name',
        displayStyle: 'line'
    })
    name!: string;

    constructor(entity?: TestEntityConstruct) {
        super();
        EntityUtilities.construct(this, entity);
    }
}

class TestEntityBuild extends Entity {
    @string({
        displayName: 'Name',
        displayStyle: 'line'
    })
    name!: string;

    constructor(entity?: TestEntityBuild) {
        super();
        EntityUtilities.build(this, entity);
    }
}

test('Should create a new entity', () => {
    const testEntity = new TestEntity({ id: '1', name: 'John Smith' });
    expect(testEntity.id).toBe('1');
    expect(testEntity.name).toBe('John Smith');
});
test('All creation methods should have the same outcome', () => {
    const testEntityNew = new TestEntity({ id: '1', name: 'John Smith' });
    const testEntityConstruct = new TestEntityConstruct({
        id: '1',
        name: 'John Smith'
    });
    const testEntityBuild = new TestEntityBuild({
        id: '1',
        name: 'John Smith'
    });
    expect(testEntityNew).toEqual(testEntityConstruct);
    expect(testEntityNew).toEqual(testEntityBuild);
    expect(testEntityConstruct).toEqual(testEntityBuild);
});