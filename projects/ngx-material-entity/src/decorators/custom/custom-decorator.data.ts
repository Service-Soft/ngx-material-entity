import { Type } from '@angular/core';
import { BaseEntityType } from '../../classes/entity.model';
import { NgxMatEntityBaseInputComponent } from '../../components/input/base-input.component';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { PropertyDecoratorConfig } from '../base/property-decorator.data';

/**
 * Definition for a custom property. Use this if the provided decorators don't fit your needs.
 */
export interface CustomDecoratorConfig<
    EntityType extends BaseEntityType<EntityType>,
    ValueType,
    CustomMetadataType extends BaseEntityType<CustomMetadataType>,
    ComponentType extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.CUSTOM, ValueType, CustomMetadataType>
> extends PropertyDecoratorConfig<ValueType> {
    /**
     * The component to use for this input.
     */
    component: Type<ComponentType>,
    /**
     * The function that defines whether or not the value is valid.
     * Used in addition to default checks like required etc.
     * Needed for the edit and create dialogs.
     *
     * TIP: If you need additional data for checking if the value is valid, you can define them as metadata directly on the value.
     * @default () => true
     */
    isValid?: (value: ValueType, omit?: 'create' | 'update') => boolean,
    /**
     * The function that defines whether or not two of your custom values are equal.
     * Needed for the edit and create dialogs.
     *
     * TIP: If you need additional data for checking if the value is valid, you can define them as metadata directly on the values.
     * @default (value: ValueType, valuePriorChanges: ValueType) => LodashUtilities.isEqual(value, valuePriorChanges)
     */
    // eslint-disable-next-line max-len
    isEqual?: (value: ValueType, valuePriorChanges: ValueType, metadata: CustomDecoratorConfig<EntityType, ValueType, CustomMetadataType, ComponentType>) => boolean,
    /**
     * Any custom metadata you want to add to the property.
     */
    customMetadata: CustomMetadataType
}