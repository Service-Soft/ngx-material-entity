import { Type } from '@angular/core';
import { BaseEntityType } from '../../classes/entity.model';
import { NgxMatEntityBaseInputComponent } from '../../components/input/base-input.component';
import { LodashUtilities } from '../../encapsulation/lodash.utilities';
import { defaultTrue } from '../../functions/default-true.function';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { CustomDecoratorConfig } from './custom-decorator.data';

/**
 * The default function to use for checking if the value is dirty.
 * @param value - The current value.
 * @param valuePriorChanges - The value before any changes.
 * @returns Whether or not the provided value has been changed.
 */
function defaultIsEqual<ValueType>(value: ValueType, valuePriorChanges: ValueType): boolean {
    return LodashUtilities.isEqual(value, valuePriorChanges);
}

/**
 * The internal config for the @custom decorator.
 * Sets default values.
 */
export class CustomDecoratorConfigInternal<
    EntityType extends BaseEntityType<EntityType>,
    ValueType,
    MetadataType extends BaseEntityType<MetadataType>,
    ComponentType extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.CUSTOM, ValueType, MetadataType>
> extends PropertyDecoratorConfigInternal<ValueType> implements CustomDecoratorConfig<EntityType, ValueType, MetadataType, ComponentType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    component: Type<ComponentType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    isValid: (value: ValueType, omit?: 'create' | 'update') => boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    isEqual: (value: ValueType, valuePriorChanges: ValueType, metadata: CustomDecoratorConfig<EntityType, ValueType, MetadataType, ComponentType>) => boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    customMetadata: MetadataType;

    constructor(data: CustomDecoratorConfig<EntityType, ValueType, MetadataType, ComponentType>) {
        super(data);
        this.component = data.component;
        this.isValid = data.isValid ?? defaultTrue;
        this.isEqual = data.isEqual ?? defaultIsEqual;
        this.customMetadata = data.customMetadata;
    }
}