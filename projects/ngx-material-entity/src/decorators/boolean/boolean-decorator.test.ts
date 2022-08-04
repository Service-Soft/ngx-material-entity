import { Entity } from '../../classes/entity.model';
import { EntityUtilities } from '../../classes/entity.utilities';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { boolean } from './boolean.decorator';
import { expect } from '@jest/globals';

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
    const metadata = EntityUtilities.getPropertyMetadata(booleanTestEntity, 'booleanCheckbox', DecoratorTypes.BOOLEAN_CHECKBOX);
    expect(metadata).toBeDefined();
    expect(metadata.displayStyle).toBe('checkbox');
});
test('should have booleanDropdown Metadata', () => {
    const metadata = EntityUtilities.getPropertyMetadata(booleanTestEntity, 'booleanDropdown', DecoratorTypes.BOOLEAN_DROPDOWN);
    expect(metadata).toBeDefined();
    expect(metadata.displayStyle).toBe('dropdown');
    expect(metadata.dropdownFalse).toBe('private customer');
    expect(metadata.dropdownTrue).toBe('business');
});
test('should have booleanToggle Metadata', () => {
    const metadata = EntityUtilities.getPropertyMetadata(booleanTestEntity, 'booleanToggle', DecoratorTypes.BOOLEAN_TOGGLE);
    expect(metadata).toBeDefined();
    expect(metadata.displayStyle).toBe('toggle');
});