import { Entity } from '../../classes/entity-model.class';
import { EntityUtilities } from '../../classes/entity-utilities.class';
import { DecoratorTypes } from '../../decorators/base/decorator-types.enum';
import { string } from '../../decorators/string.decorator';

class TestEntity extends Entity {

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
const testEntityData = {
    id: '1',
    name: 'John Smith'
};
const testEntity = new TestEntity(testEntityData);

test('id should have base Metadata', () => {
    const metdata = EntityUtilities.getPropertyMetadata(testEntity, 'id', DecoratorTypes.STRING);
    expect(metdata).toBeDefined();
    expect(metdata.display).toBe(false);
    expect(metdata.displayName).toBe('ID');
    expect(metdata.omitForCreate).toBe(true);
    expect(metdata.omitForUpdate).toBe(true);
    expect(metdata.required).toBe(true);
});