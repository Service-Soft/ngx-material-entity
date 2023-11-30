import { expect } from '@jest/globals';
import { Entity } from '../../classes/entity.model';
import { EntityUtilities } from '../../utilities/entity.utilities';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { AutocompleteStringDecoratorConfigInternal, DefaultStringDecoratorConfigInternal, DropdownStringDecoratorConfigInternal } from './string-decorator-internal.data';
import { string } from './string.decorator';

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
        displayStyle: 'dropdown',
        displayName: 'Name',
        dropdownValues: () => [
            { displayName: 'John Smith', value: 'johnSmith' },
            { displayName: 'Jane Smith', value: 'janeSmith' }
        ]
    })
    nameDropdownWithFunction!: string;

    @string({
        displayStyle: 'autocomplete',
        displayName: 'Name',
        autocompleteValues: ['Mr.', 'Ms.']
    })
    nameAutocomplete!: string;

    @string({
        displayStyle: 'autocomplete',
        displayName: 'Name',
        autocompleteValues: () => ['Mr.', 'Ms.']
    })
    nameAutocompleteWithFunction!: string;

    notDecoratedProperty!: string;

    constructor(entity?: TestEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}
const testEntityData: TestEntity = {
    id: '1',
    name: 'John Smith',
    nameDropdown: 'John Smith',
    nameDropdownWithFunction: 'John Smith',
    nameAutocomplete: 'Mr.',
    nameAutocompleteWithFunction: 'Mr.',
    notDecoratedProperty: '42'
};
const testEntity: TestEntity = new TestEntity(testEntityData);

test('name should have string Metadata', () => {
    const metadata: DefaultStringDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(testEntity, 'name', DecoratorTypes.STRING);
    expect(metadata).toBeDefined();
    expect(metadata?.displayStyle).toBe('line');
    expect(metadata?.minLength).toBe(5);
    expect(metadata?.maxLength).toBe(100);
});
test('nameDropdown should have stringDropdown Metadata', async () => {
    const metadata: DropdownStringDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(
        testEntity,
        'nameDropdown',
        DecoratorTypes.STRING_DROPDOWN
    );
    expect(metadata).toBeDefined();
    expect(metadata?.displayStyle).toBe('dropdown');
    expect(await metadata?.dropdownValues(testEntity)).toEqual([
        { displayName: 'John Smith', value: 'johnSmith' },
        { displayName: 'Jane Smith', value: 'janeSmith' }
    ]);

    const metadata2: DropdownStringDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(
        testEntity,
        'nameDropdownWithFunction',
        DecoratorTypes.STRING_DROPDOWN
    );
    expect(metadata2).toBeDefined();
    expect(metadata2?.displayStyle).toBe('dropdown');
    expect(await metadata2?.dropdownValues(testEntity)).toEqual([
        { displayName: 'John Smith', value: 'johnSmith' },
        { displayName: 'Jane Smith', value: 'janeSmith' }
    ]);
});
test('should have stringAutocomplete Metadata', async () => {
    const metadata: AutocompleteStringDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(
        testEntity,
        'nameAutocomplete',
        DecoratorTypes.STRING_AUTOCOMPLETE
    );
    expect(metadata).toBeDefined();
    expect(metadata?.displayStyle).toBe('autocomplete');
    expect(await metadata?.autocompleteValues(testEntity)).toEqual(['Mr.', 'Ms.']);

    const metadata2: AutocompleteStringDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(
        testEntity,
        'nameAutocompleteWithFunction',
        DecoratorTypes.STRING_AUTOCOMPLETE
    );
    expect(metadata2).toBeDefined();
    expect(metadata2?.displayStyle).toBe('autocomplete');
    expect(await metadata2?.autocompleteValues(testEntity)).toEqual(['Mr.', 'Ms.']);
});