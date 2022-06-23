import { Entity } from '../../classes/entity-model.class';
import { EntityUtilities } from '../../classes/entity-utilities.class';
import { DecoratorTypes } from '../../decorators/base/decorator-types.enum';
import { object } from '../../decorators/object.decorator';
import { string } from '../../decorators/string.decorator';

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
    @object({
        type: Address,
        displayName: 'Adresse',
        displayStyle: 'inline',
        sectionTitle: 'Adressdaten'
    })
    address!: Address;

    constructor(entity?: TestEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}

const addressData: Address = {
    id: '1',
    street: 'Schultenstraße',
    number: '5',
    postcode: '45739',
    city: 'Oer-Erkenschwick'
};
const address = new Address(addressData);

const testEntityData: TestEntity = {
    id: '1',
    address: address
};
const testEntity = new TestEntity(testEntityData);

test('should have object Metadata', () => {
    const metdata = EntityUtilities.getPropertyMetadata(testEntity, 'address', DecoratorTypes.OBJECT);
    expect(metdata).toBeDefined();
    expect(metdata.type).toBe(Address);
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