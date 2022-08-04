import { Entity } from '../../classes/entity.model';
import { EntityUtilities } from '../../classes/entity.utilities';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { object } from './object.decorator';
import { string } from '../string/string.decorator';
import { expect } from '@jest/globals';

class Address extends Entity {
    @string({
        displayStyle: 'line',
        displayName: 'Street'
    })
    street!: string;

    @string({
        displayStyle: 'line',
        displayName: 'Number'
    })
    number!: string;

    @string({
        displayStyle: 'line',
        displayName: 'City',
        minLength: 5,
        maxLength: 5,
        regex: /^[0-9]*$/
    })
    postcode!: string;

    @string({
        displayStyle: 'line',
        displayName: 'Postcode'
    })
    city!: string;

    constructor(entity?: Address) {
        super();
        EntityUtilities.new(this, entity);
    }
}

class TestEntity extends Entity {
    @object({
        EntityClass: Address,
        displayName: 'Address',
        displayStyle: 'inline'
    })
    address!: Address;

    constructor(entity?: TestEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}

const addressData: Address = {
    id: '1',
    street: 'Main Street',
    number: '42',
    postcode: '12345',
    city: 'Example City'
};
const address = new Address(addressData);

const testEntityData: TestEntity = {
    id: '1',
    address: address
};
const testEntity = new TestEntity(testEntityData);

test('should have object Metadata', () => {
    const metadata = EntityUtilities.getPropertyMetadata(testEntity, 'address', DecoratorTypes.OBJECT);
    expect(metadata).toBeDefined();
    expect(metadata.EntityClass).toBe(Address);
});
test('should have metadata on the object', () => {
    const streetMetadata = EntityUtilities.getPropertyMetadata(testEntity.address, 'street', DecoratorTypes.STRING);
    const numberMetadata = EntityUtilities.getPropertyMetadata(testEntity.address, 'number', DecoratorTypes.STRING);
    const postcodeMetadata = EntityUtilities.getPropertyMetadata(testEntity.address, 'postcode', DecoratorTypes.STRING);
    const cityMetadata = EntityUtilities.getPropertyMetadata(testEntity.address, 'city', DecoratorTypes.STRING);
    expect(streetMetadata).toBeDefined();
    expect(numberMetadata).toBeDefined();
    expect(postcodeMetadata).toBeDefined();
    expect(cityMetadata).toBeDefined();
});