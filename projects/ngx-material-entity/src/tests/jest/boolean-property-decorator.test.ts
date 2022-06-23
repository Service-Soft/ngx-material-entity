import { Entity } from '../../classes/entity-model.class';
import { EntityUtilities } from '../../classes/entity-utilities.class';
import { DecoratorTypes } from '../../decorators/base/decorator-types.enum';
import { boolean } from '../../decorators/boolean.decorator';

class TestEntity extends Entity {
    @boolean({
        displayStyle: 'checkbox',
        displayName: 'company?'
    })
    boolean!: boolean;

    @boolean({
        displayStyle: 'dropdown',
        displayName: 'I am...',
        dropdownFalse: 'private customer',
        dropdownTrue: 'business'
    })
    booleanDropdown!: boolean;

    constructor(entity?: TestEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}
const testEntityData: TestEntity = {
    id: '1',
    boolean: true,
    booleanDropdown: false
};
const testEntity = new TestEntity(testEntityData);

test('should have boolean Metadata', () => {
    const metdata = EntityUtilities.getPropertyMetadata(testEntity, 'boolean', DecoratorTypes.BOOLEAN_CHECKBOX);
    expect(metdata).toBeDefined();
    expect(metdata.displayStyle).toBe('checkbox');
});
test('should have booleanDropdown Metadata', () => {
    const metdata = EntityUtilities.getPropertyMetadata(testEntity, 'booleanDropdown', DecoratorTypes.BOOLEAN_DROPDOWN);
    expect(metdata).toBeDefined();
    expect(metdata.displayStyle).toBe('dropdown');
    expect(metdata.dropdownFalse).toBe('private customer');
    expect(metdata.dropdownTrue).toBe('business');
});