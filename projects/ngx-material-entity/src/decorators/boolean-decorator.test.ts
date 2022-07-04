import { Entity } from '../classes/entity-model.class';
import { EntityUtilities } from '../classes/entity-utilities.class';
import { DecoratorTypes } from './base/decorator-types.enum';
import { boolean } from './boolean.decorator';

class BooleanTestEntity extends Entity {
    @boolean({
        displayStyle: 'checkbox',
        displayName: 'company?'
    })
    booleanCheckbox!: boolean;

    @boolean({
        displayStyle: 'dropdown',
        displayName: 'I am...',
        dropdownFalse: 'private customer',
        dropdownTrue: 'business'
    })
    booleanDropdown!: boolean;

    @boolean({
        displayStyle: 'toggle',
        displayName: 'company?'
    })
    booleanToggle!: boolean;

    constructor(entity?: BooleanTestEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}
const booleanTestEntityData: BooleanTestEntity = {
    id: '1',
    booleanCheckbox: true,
    booleanDropdown: false,
    booleanToggle: true
};
const booleanTestEntity = new BooleanTestEntity(booleanTestEntityData);

test('should have boolean Metadata', () => {
    const metdata = EntityUtilities.getPropertyMetadata(booleanTestEntity, 'booleanCheckbox', DecoratorTypes.BOOLEAN_CHECKBOX);
    expect(metdata).toBeDefined();
    expect(metdata.displayStyle).toBe('checkbox');
});
test('should have booleanDropdown Metadata', () => {
    const metdata = EntityUtilities.getPropertyMetadata(booleanTestEntity, 'booleanDropdown', DecoratorTypes.BOOLEAN_DROPDOWN);
    expect(metdata).toBeDefined();
    expect(metdata.displayStyle).toBe('dropdown');
    expect(metdata.dropdownFalse).toBe('private customer');
    expect(metdata.dropdownTrue).toBe('business');
});
test('should have booleanToggle Metadata', () => {
    const metdata = EntityUtilities.getPropertyMetadata(booleanTestEntity, 'booleanToggle', DecoratorTypes.BOOLEAN_TOGGLE);
    expect(metdata).toBeDefined();
    expect(metdata.displayStyle).toBe('toggle');
});