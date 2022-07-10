import { array } from './array.decorator';
import { expect } from '@jest/globals';
import { Entity } from '../../classes/entity-model.class';
import { string } from '../string/string.decorator';
import { EntityUtilities } from '../../classes/entity-utilities.class';
import { DecoratorTypes } from '../base/decorator-types.enum';

class Address extends Entity {
    @string({
        displayStyle: 'line',
        displayName: 'Straße'
    })
    street!: string;

    @string({
        displayStyle: 'line',
        displayName: 'Hausnummer'
    })
    number!: string;

    @string({
        displayStyle: 'line',
        displayName: 'PLZ',
        minLength: 5,
        maxLength: 5,
        regex: /^[0-9]*$/
    })
    postcode!: string;

    @string({
        displayStyle: 'line',
        displayName: 'Ort'
    })
    city!: string;

    constructor(entity?: Address) {
        super();
        EntityUtilities.new(this, entity);
    }
}

class TestEntity extends Entity {
    @array({
        itemType: DecoratorTypes.OBJECT,
        displayName: 'Adressen',
        displayStyle: 'table',
        EntityClass: Address,
        displayColumns: []
    })
    addresses!: Address[];

    constructor(entity?: TestEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}

const addressData1: Address = {
    id: '1',
    street: 'Schultenstraße',
    number: '5',
    postcode: '45739',
    city: 'Oer-Erkenschwick'
};
const address1 = new Address(addressData1);
const addressData2: Address = {
    id: '2',
    street: 'Hufschmiedstraße',
    number: '17',
    postcode: '45665',
    city: 'Recklinghausen'
};
const address2 = new Address(addressData2);

const testEntityData: TestEntity = {
    id: '1',
    addresses: [address1, address2]
};
const testEntity = new TestEntity(testEntityData);

test('should have array Metadata', () => {
    const metdata = EntityUtilities.getPropertyMetadata(testEntity, 'addresses', DecoratorTypes.ARRAY);
    expect(metdata).toBeDefined();
    expect(metdata.EntityClass).toBeDefined();
    expect(metdata.displayStyle).toEqual('table');
    expect(metdata.itemType).toEqual(DecoratorTypes.OBJECT);
    expect(metdata.displayColumns).toEqual([]);
});
test('should have metadata on array items', () => {
    const streetMetadata1 = EntityUtilities.getPropertyMetadata(testEntity.addresses[0], 'street', DecoratorTypes.STRING);
    const numberMetadata1 = EntityUtilities.getPropertyMetadata(testEntity.addresses[0], 'number', DecoratorTypes.STRING);
    const postcodeMetadata1 = EntityUtilities.getPropertyMetadata(testEntity.addresses[0], 'postcode', DecoratorTypes.STRING);
    const cityMetadata1 = EntityUtilities.getPropertyMetadata(testEntity.addresses[0], 'city', DecoratorTypes.STRING);
    const streetMetadata2 = EntityUtilities.getPropertyMetadata(testEntity.addresses[1], 'street', DecoratorTypes.STRING);
    const numberMetadata2 = EntityUtilities.getPropertyMetadata(testEntity.addresses[1], 'number', DecoratorTypes.STRING);
    const postcodeMetadata2 = EntityUtilities.getPropertyMetadata(testEntity.addresses[1], 'postcode', DecoratorTypes.STRING);
    const cityMetadata2 = EntityUtilities.getPropertyMetadata(testEntity.addresses[1], 'city', DecoratorTypes.STRING);
    expect(streetMetadata1).toBeDefined();
    expect(numberMetadata1).toBeDefined();
    expect(postcodeMetadata1).toBeDefined();
    expect(cityMetadata1).toBeDefined();
    expect(streetMetadata2).toBeDefined();
    expect(numberMetadata2).toBeDefined();
    expect(postcodeMetadata2).toBeDefined();
    expect(cityMetadata2).toBeDefined();
});
test('should throw error for invalid itemType metadata', () => {
    expect(
        () => {
            class ArrayTestEntity extends Entity {
                @array({
                    displayStyle: 'chips',
                    displayName: 'Wrong itemType Array Value',
                    itemType: 'invalidValue' as DecoratorTypes.STRING
                })
                wrongItemTypeArrayValue!: string[];
                constructor(entity?: ArrayTestEntity) {
                    super();
                    EntityUtilities.new(this, entity);
                }
            }
            new ArrayTestEntity({
                id: '1',
                wrongItemTypeArrayValue: ['42']
            });
        }
    ).toThrow('Unknown itemType invalidValue');
});