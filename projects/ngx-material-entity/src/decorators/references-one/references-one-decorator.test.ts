import { expect } from '@jest/globals';
import { firstValueFrom, of } from 'rxjs';
import { EntityUtilities } from '../../utilities/entity.utilities';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { DropdownValue } from '../base/dropdown-value.interface';
import { defaultGetEntityForId } from '../references-many/references-many-decorator-internal.data';
import { string } from '../string/string.decorator';
import { ReferencesOneDecoratorConfigInternal } from './references-one-decorator-internal.data';
import { referencesOne } from './references-one.decorator';

class Address {
    @string({
        displayName: 'ID',
        displayStyle: 'line',
        required: true,
        omitForCreate: true,
        omitForUpdate: true
    })
    id!: string;

    @string({
        displayName: 'Street',
        displayStyle: 'line'
    })
    street!: string;

    @string({
        displayName: 'Number',
        displayStyle: 'line'
    })
    number!: string;

    @string({
        displayName: 'Postcode',
        displayStyle: 'line',
        regex: new RegExp('^[0-9]+$'),
        maxLength: 5,
        minLength: 5
    })
    postcode!: string;

    @string({
        displayName: 'City',
        displayStyle: 'line'
    })
    city!: string;

    constructor(entity?: Address) {
        EntityUtilities.new(this, entity);
    }
}

class TestEntity {
    @string({
        displayName: 'ID',
        displayStyle: 'line',
        required: true,
        omitForCreate: true,
        omitForUpdate: true
    })
    id!: string;

    @referencesOne({
        displayName: 'Addresses',
        getReferencedEntities: getReferencedEntities,
        getDropdownValues: getDropdownValues,
        EntityClass: Address
    })
    addressId!: string[];

    constructor(entity?: TestEntity) {
        EntityUtilities.new(this, entity);
    }
}

async function getReferencedEntities(): Promise<Address[]> {
    return firstValueFrom(of([{ id: '1', street: 'Example Street', number: '42', postcode: '12345', city: 'Example City' }]));
}

function getDropdownValues(entities: Address[]): DropdownValue<string>[] {
    return entities.map(e => {
        return {
            displayName: `${e.street} ${e.number}, ${e.postcode} ${e.city}`,
            value: e.id
        };
    });
}

const testEntityData: TestEntity = {
    id: '1',
    addressId: ['1']
};
const testEntity: TestEntity = new TestEntity(testEntityData);

describe('referencesOne', () => {
    test('should have references many Metadata', () => {
        const metadata: ReferencesOneDecoratorConfigInternal<Address> | undefined
            = EntityUtilities.getPropertyMetadata(
                testEntity,
                'addressId',
                DecoratorTypes.REFERENCES_ONE
            );
        expect(metadata).toBeDefined();
        expect(metadata?.getReferencedEntities).toEqual(getReferencedEntities);
        expect(metadata?.getDropdownValues).toEqual(getDropdownValues);
        expect(metadata?.EntityClass).toEqual(Address);
        expect(metadata?.defaultWidths).toEqual([12, 12, 12]);
        expect(metadata?.getEntityForId).toEqual(defaultGetEntityForId);
    });

    test('should return correct values for getReferencedEntities and getDropdownValues', async () => {
        const metadata: ReferencesOneDecoratorConfigInternal<Address> | undefined
            = EntityUtilities.getPropertyMetadata(
                testEntity,
                'addressId',
                DecoratorTypes.REFERENCES_ONE
            );
        const referencedEntities: Address[] = (await metadata?.getReferencedEntities()) ?? [];
        expect(referencedEntities).toEqual([{ id: '1', street: 'Example Street', number: '42', postcode: '12345', city: 'Example City' }]);
        const dropdownValues: DropdownValue<string>[] | undefined = metadata?.getDropdownValues(referencedEntities);
        expect(dropdownValues).toEqual([{
            displayName: 'Example Street 42, 12345 Example City',
            value: '1'
        }]);
    });

    test('should return correct values for default getEntityForId method', async () => {
        const metadata: ReferencesOneDecoratorConfigInternal<Address> | undefined
            = EntityUtilities.getPropertyMetadata(
                testEntity,
                'addressId',
                DecoratorTypes.REFERENCES_ONE
            );
        const referencedEntities: Address[] = (await metadata?.getReferencedEntities()) ?? [];
        const entityForId: Address | undefined = metadata?.getEntityForId('1', referencedEntities);
        expect(entityForId).toEqual({ id: '1', street: 'Example Street', number: '42', postcode: '12345', city: 'Example City' });
    });
});