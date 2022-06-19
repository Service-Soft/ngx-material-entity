import { Entity } from '../../classes/entity-model.class';
import { EntityUtilities } from '../../classes/entity-utilities.class';
import { DecoratorTypes } from '../../decorators/base/decorator-types.enum';
import { number } from '../../decorators/number.decorator';

class TestEntity extends Entity {

    @number({
        displayStyle: 'line',
        displayName: 'total price',
    })
    number!: number;

    @number({
        displayStyle: 'dropdown',
        displayName: 'maximum amount of users',
        dropdownValues: [
            { displayName: '1', value: 1 },
            { displayName: '5', value: 5 },
            { displayName: '10', value: 10 },
            { displayName: '15', value: 15 },
            { displayName: '20', value: 20 }
        ]
    })
    numberDropdown!: number;

    constructor(entity?: TestEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}
const testEntityData: TestEntity = {
    id: '1',
    number: 1234.56,
    numberDropdown: 15
};
const testEntity = new TestEntity(testEntityData);

test('number should have number Metadata', () => {
    const metdata = EntityUtilities.getPropertyMetadata(testEntity, 'number', DecoratorTypes.NUMBER);
    expect(metdata).toBeDefined();
    expect(metdata.displayStyle).toBe('line');
});
test('should have numberDropdown Metadata', () => {
    const metdata = EntityUtilities.getPropertyMetadata(testEntity, 'numberDropdown', DecoratorTypes.NUMBER_DROPDOWN);
    expect(metdata).toBeDefined();
    expect(metdata.displayStyle).toBe('dropdown');
    expect(metdata.dropdownValues).toEqual(
        [
            { displayName: '1', value: 1 },
            { displayName: '5', value: 5 },
            { displayName: '10', value: 10 },
            { displayName: '15', value: 15 },
            { displayName: '20', value: 20 }
        ]
    );
});