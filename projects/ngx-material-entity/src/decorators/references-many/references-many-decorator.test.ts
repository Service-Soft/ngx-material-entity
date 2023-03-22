import { expect } from '@jest/globals';
import { firstValueFrom, of } from 'rxjs';
import { BaseEntityType } from '../../classes/entity.model';
import { EntityUtilities } from '../../utilities/entity.utilities';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { DropdownValue } from '../base/dropdown-value.interface';
import { string } from '../string/string.decorator';
import { ReferencesManyDecoratorConfigInternal } from './references-many-decorator-internal.data';
import { referencesMany } from './references-many.decorator';

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

    @referencesMany({
        displayName: 'Addresses',
        getReferencedEntities: getReferencedEntities,
        getDropdownValues: getDropdownValues,
        displayColumns: [
            {
                displayName: 'Address',
                value: (address: Address) => `${address?.street} ${address?.number}, ${address?.postcode} ${address?.city}`
            }
        ]
    })
    addressIds!: string[];

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
    addressIds: ['1']
};
const testEntity: TestEntity = new TestEntity(testEntityData);

test('should have references many Metadata', () => {
    const metadata: ReferencesManyDecoratorConfigInternal<Address>
        = EntityUtilities.getPropertyMetadata(
            testEntity,
            'addressIds',
            DecoratorTypes.REFERENCES_MANY
        ) as ReferencesManyDecoratorConfigInternal<Address>;
    expect(metadata).toBeDefined();
    expect(metadata.getReferencedEntities).toEqual(getReferencedEntities);
    expect(metadata.getDropdownValues).toEqual(getDropdownValues);
    expect(metadata.addAll).toEqual(false);
    expect(metadata.addAllButtonLabel).toEqual('Add all');
    expect(metadata.defaultWidths).toEqual([12, 12, 12]);
    expect(metadata.addButtonLabel).toEqual('Add');
    expect(metadata.dropdownLabel).toEqual('Select');
    expect(JSON.stringify(metadata.getEntityForId)).toEqual(JSON.stringify(defaultGetEntityForId));
    expect(metadata.removeButtonLabel).toEqual('Remove');
});

test('should return correct values for getReferencedEntities and getDropdownValues', async () => {
    const metadata: ReferencesManyDecoratorConfigInternal<Address>
        = EntityUtilities.getPropertyMetadata(
            testEntity,
            'addressIds',
            DecoratorTypes.REFERENCES_MANY
        ) as ReferencesManyDecoratorConfigInternal<Address>;
    const referencedEntities: Address[] = await metadata.getReferencedEntities();
    expect(referencedEntities).toEqual([{ id: '1', street: 'Example Street', number: '42', postcode: '12345', city: 'Example City' }]);
    const dropdownValues: DropdownValue<string>[] = metadata.getDropdownValues(referencedEntities);
    expect(dropdownValues).toEqual([{
        displayName: 'Example Street 42, 12345 Example City',
        value: '1'
    }]);
});

test('should return correct values for default getEntityForId method', async () => {
    const metadata: ReferencesManyDecoratorConfigInternal<Address>
        = EntityUtilities.getPropertyMetadata(
            testEntity,
            'addressIds',
            DecoratorTypes.REFERENCES_MANY
        ) as ReferencesManyDecoratorConfigInternal<Address>;
    const referencedEntities: Address[] = await metadata.getReferencedEntities();
    const entityForId: Address = metadata.getEntityForId('1', referencedEntities);
    expect(entityForId).toEqual({ id: '1', street: 'Example Street', number: '42', postcode: '12345', city: 'Example City' });
});

function defaultGetEntityForId<EntityType extends BaseEntityType<EntityType>>(
    entityId: string,
    allReferencedEntities: EntityType[]
): EntityType {
    return allReferencedEntities.find(e => e['id' as keyof EntityType] === entityId) as EntityType;
}