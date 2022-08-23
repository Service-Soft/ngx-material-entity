import { BaseEntityType } from '../../classes/entity.model';
import { NgxMatEntityBaseInputComponent } from '../../components/input/base-input.component';
import { baseProperty } from '../base/base-property.decorator';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { CustomDecoratorConfigInternal } from './custom-decorator-internal.data';
import { CustomDecoratorConfig } from './custom-decorator.data';

/**
 * Decorator for setting and getting custom property metadata.
 *
 * @param metadata - The metadata of the custom property.
 * @returns The method that defines the metadata.
 */
export function custom<
    ValueType,
    MetadataType extends BaseEntityType<MetadataType>,
    EntityType extends BaseEntityType<EntityType>
>(
    metadata: CustomDecoratorConfig<
        EntityType,
        ValueType,
        MetadataType,
        NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.CUSTOM, MetadataType>
    >
): (target: object, propertyKey: string) => void {
    return baseProperty<DecoratorTypes.CUSTOM, MetadataType>(new CustomDecoratorConfigInternal(metadata), DecoratorTypes.CUSTOM);
}