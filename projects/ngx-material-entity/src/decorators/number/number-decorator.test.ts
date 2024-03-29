import { expect } from '@jest/globals';
import { Entity } from '../../classes/entity.model';
import { EntityUtilities } from '../../utilities/entity.utilities';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { defaultFormatThumbLabelValue, DefaultNumberDecoratorConfigInternal, DropdownNumberDecoratorConfigInternal, SliderNumberDecoratorConfigInternal } from './number-decorator-internal.data';
import { number } from './number.decorator';

class TestEntity extends Entity {
    @number({
        displayStyle: 'line',
        displayName: 'total price'
    })
    number!: number;

    @number({
        displayStyle: 'slider',
        displayName: 'Number Slider Value',
        min: 10
    })
    numberSlider!: number;

    @number({
        displayStyle: 'dropdown',
        displayName: 'maximum amount of users',
        dropdownValues: [
            { displayName: '1', value: 1 },
            { displayName: '5', value: 5 },
            { displayName: '10', value: 10 },
            { displayName: '15', value: 15 },
            { displayName: '20', value: 20 }
        ]
    })
    numberDropdown!: number;

    @number({
        displayStyle: 'dropdown',
        displayName: 'maximum amount of users',
        dropdownValues: () => [
            { displayName: '1', value: 1 },
            { displayName: '5', value: 5 },
            { displayName: '10', value: 10 },
            { displayName: '15', value: 15 },
            { displayName: '20', value: 20 }
        ]
    })
    numberDropdownWithFunction!: number;

    constructor(entity?: TestEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}
const testEntityData: TestEntity = {
    id: '1',
    number: 1234.56,
    numberSlider: 12,
    numberDropdown: 15,
    numberDropdownWithFunction: 15
};
const testEntity: TestEntity = new TestEntity(testEntityData);

test('number should have number Metadata', () => {
    const metadata: DefaultNumberDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(testEntity, 'number', DecoratorTypes.NUMBER);
    expect(metadata).toBeDefined();
    expect(metadata?.displayStyle).toBe('line');
});
test('should have numberSlider Metadata', () => {
    const metadata: SliderNumberDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(testEntity, 'numberSlider', DecoratorTypes.NUMBER_SLIDER);
    expect(metadata).toBeDefined();
    expect(metadata?.displayStyle).toBe('slider');
    expect(JSON.stringify(metadata?.formatThumbLabelValue)).toEqual(JSON.stringify(((value: number) => value)));
});
test('default format thumb label value should just return the value without any changes', () => {
    expect(defaultFormatThumbLabelValue(42)).toEqual('42');
});
test('should have numberDropdown Metadata', async () => {
    const metadata: DropdownNumberDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(testEntity, 'numberDropdown', DecoratorTypes.NUMBER_DROPDOWN);
    expect(metadata).toBeDefined();
    expect(metadata?.displayStyle).toBe('dropdown');
    expect(await metadata?.dropdownValues(testEntity)).toEqual([
        { displayName: '1', value: 1 },
        { displayName: '5', value: 5 },
        { displayName: '10', value: 10 },
        { displayName: '15', value: 15 },
        { displayName: '20', value: 20 }
    ]);

    const metadata2: DropdownNumberDecoratorConfigInternal | undefined = EntityUtilities.getPropertyMetadata(
        testEntity,
        'numberDropdownWithFunction',
        DecoratorTypes.NUMBER_DROPDOWN
    );
    expect(metadata2).toBeDefined();
    expect(metadata2?.displayStyle).toBe('dropdown');
    expect(await metadata2?.dropdownValues(testEntity)).toEqual([
        { displayName: '1', value: 1 },
        { displayName: '5', value: 5 },
        { displayName: '10', value: 10 },
        { displayName: '15', value: 15 },
        { displayName: '20', value: 20 }
    ]);
});