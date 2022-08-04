import { Entity } from '../../classes/entity.model';
import { EntityUtilities } from '../../classes/entity.utilities';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { string } from './string.decorator';
import { expect } from '@jest/globals';

class TestEntity extends Entity {
    @string({
        displayStyle: 'line',
        displayName: 'Name',
        minLength: 5,
        maxLength: 100
    })
    name!: string;

    @string({
        displayStyle: 'dropdown',
        displayName: 'Name',
        dropdownValues: [
            { displayName: 'John Smith', value: 'johnSmith' },
            { displayName: 'Jane Smith', value: 'janeSmith' }
        ]
    })
    nameDropdown!: string;

    @string({
        displayStyle: 'autocomplete',
        displayName: 'Name',
        autocompleteValues: ['Mr.', 'Ms.']
    })
    nameAutocomplete!: string;

    constructor(entity?: TestEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}
const testEntityData: TestEntity = {
    id: '1',
    name: 'John Smith',
    nameDropdown: 'johnSmith',
    nameAutocomplete: 'Mr.'
};
const testEntity = new TestEntity(testEntityData);

test('name should have string Metadata', () => {
    const metadata = EntityUtilities.getPropertyMetadata(testEntity, 'name', DecoratorTypes.STRING);
    expect(metadata).toBeDefined();
    expect(metadata.displayStyle).toBe('line');
    expect(metadata.minLength).toBe(5);
    expect(metadata.maxLength).toBe(100);
});
test('nameDropdown should have stringDropdown Metadata', () => {
    const metadata = EntityUtilities.getPropertyMetadata(testEntity, 'nameDropdown', DecoratorTypes.STRING_DROPDOWN);
    expect(metadata).toBeDefined();
    expect(metadata.displayStyle).toBe('dropdown');
    expect(metadata.dropdownValues).toEqual([
        { displayName: 'John Smith', value: 'johnSmith' },
        { displayName: 'Jane Smith', value: 'janeSmith' }
    ]);
});
test('should have stringAutocomplete Metadata', () => {
    const metadata = EntityUtilities.getPropertyMetadata(
        testEntity,
        'nameAutocomplete',
        DecoratorTypes.STRING_AUTOCOMPLETE
    );
    expect(metadata).toBeDefined();
    expect(metadata.displayStyle).toBe('autocomplete');
    expect(metadata.autocompleteValues).toEqual(['Mr.', 'Ms.']);
});