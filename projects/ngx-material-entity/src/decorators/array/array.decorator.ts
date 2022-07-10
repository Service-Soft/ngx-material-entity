import { Entity } from '../../classes/entity-model.class';
import { baseProperty } from '../base/base-property.decorator';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { AutocompleteStringChipsArrayDecoratorConfigInternal, EntityArrayDecoratorConfigInternal, StringChipsArrayDecoratorConfigInternal } from './array-decorator-internal.data';
import { AutocompleteStringChipsArrayDecoratorConfig, EntityArrayDecoratorConfig, StringChipsArrayDecoratorConfig } from './array-decorator.data';

/**
 * Decorator for setting and getting array propery metadata.
 *
 * @param metadata - The metadata of the array property.
 * @returns The method that defines the metadata.
 * @throws When the given type of the array-items is unknown.
 */
export function array<EntityType extends Entity>(
    metadata: EntityArrayDecoratorConfig<EntityType> | StringChipsArrayDecoratorConfig | AutocompleteStringChipsArrayDecoratorConfig
): (target: object, propertyKey: string) => void {
    switch (metadata.itemType) {
        case DecoratorTypes.OBJECT:
            return baseProperty(new EntityArrayDecoratorConfigInternal(metadata), DecoratorTypes.ARRAY);
        case DecoratorTypes.STRING:
            return baseProperty(new StringChipsArrayDecoratorConfigInternal(metadata), DecoratorTypes.ARRAY_STRING_CHIPS);
        case DecoratorTypes.STRING_AUTOCOMPLETE:
            return baseProperty(
                new AutocompleteStringChipsArrayDecoratorConfigInternal(metadata),
                DecoratorTypes.ARRAY_STRING_AUTOCOMPLETE_CHIPS
            );
        default:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            throw new Error(`Unknown itemType ${(metadata as any).itemType}`);
    }
}