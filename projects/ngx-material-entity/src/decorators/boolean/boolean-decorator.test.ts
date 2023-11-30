import { expect } from '@jest/globals';
import { Entity } from '../../classes/entity.model';
import { defaultGlobalDefaults } from '../../default-global-configuration-values';
import { EntityUtilities } from '../../utilities/entity.utilities';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { CheckboxBooleanDecoratorConfigInternal, DropdownBooleanDecoratorConfigInternal, ToggleBooleanDecoratorConfigInternal } from './boolean-decorator-internal.data';
import { boolean } from './boolean.decorator';

class BooleanTestEntity extends Entity {
    @boolean({
        displayStyle: 'checkbox',
        displayName: 'company?'
    })
    booleanCheckbox!: boolean;

    @boolean({
        displayStyle: 'dropdown',
        displayName: 'Boolean'
    })
    booleanDropdown!: boolean;

    @boolean({
        displayStyle: 'dropdown',
        displayName: 'I am...',
        dropdownFalse: 'private customer',
        dropdownTrue: 'business'
    })
    customBooleanDropdown!: boolean;

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
    booleanDropdown: true,
    customBooleanDropdown: false,
    booleanToggle: true
};
const booleanTestEntity: BooleanTestEntity = new BooleanTestEntity(booleanTestEntityData);

test('should have boolean Metadata', () => {
    const metadata: CheckboxBooleanDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(booleanTestEntity, 'booleanCheckbox', DecoratorTypes.BOOLEAN_CHECKBOX);
    expect(metadata).toBeDefined();
    expect(metadata?.displayStyle).toBe('checkbox');
});
test('should have booleanDropdown Metadata', () => {
    let metadata: DropdownBooleanDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(booleanTestEntity, 'booleanDropdown', DecoratorTypes.BOOLEAN_DROPDOWN);
    expect(metadata).toBeDefined();
    metadata = new DropdownBooleanDecoratorConfigInternal(metadata as DropdownBooleanDecoratorConfigInternal, defaultGlobalDefaults);
    expect(metadata.displayStyle).toBe('dropdown');
    expect(metadata.dropdownFalse).toBe('No');
    expect(metadata.dropdownTrue).toBe('Yes');
});
test('should have custom booleanDropdown Metadata', () => {
    const metadata: DropdownBooleanDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(booleanTestEntity, 'customBooleanDropdown', DecoratorTypes.BOOLEAN_DROPDOWN);
    expect(metadata).toBeDefined();
    expect(metadata?.displayStyle).toBe('dropdown');
    expect(metadata?.dropdownFalse).toBe('private customer');
    expect(metadata?.dropdownTrue).toBe('business');
});
test('should have booleanToggle Metadata', () => {
    const metadata: ToggleBooleanDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(booleanTestEntity, 'booleanToggle', DecoratorTypes.BOOLEAN_TOGGLE);
    expect(metadata).toBeDefined();
    expect(metadata?.displayStyle).toBe('toggle');
});