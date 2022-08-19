import { BaseEntityType } from '../../classes/entity.model';
import { baseProperty } from '../base/base-property.decorator';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { AutocompleteStringChipsArrayDecoratorConfigInternal, DateArrayDecoratorConfigInternal, DateRangeArrayDecoratorConfigInternal, DateTimeArrayDecoratorConfigInternal, EntityArrayDecoratorConfigInternal, StringChipsArrayDecoratorConfigInternal } from './array-decorator-internal.data';
import { AutocompleteStringChipsArrayDecoratorConfig, DateArrayDecoratorConfig, DateRangeArrayDecoratorConfig, DateTimeArrayDecoratorConfig, EntityArrayDecoratorConfig, StringChipsArrayDecoratorConfig } from './array-decorator.data';

/**
 * Decorator for setting and getting array property metadata.
 *
 * @param metadata - The metadata of the array property.
 * @returns The method that defines the metadata.
 * @throws When the given type of the array-items is unknown.
 */
export function array<EntityType extends BaseEntityType<EntityType>>(
    metadata: EntityArrayDecoratorConfig<EntityType>
                | StringChipsArrayDecoratorConfig
                | AutocompleteStringChipsArrayDecoratorConfig
                | DateArrayDecoratorConfig
                | DateTimeArrayDecoratorConfig
                | DateRangeArrayDecoratorConfig
): (target: object, propertyKey: string) => void {
    switch (metadata.itemType) {
        case DecoratorTypes.OBJECT:
            return baseProperty(new EntityArrayDecoratorConfigInternal(metadata), DecoratorTypes.ARRAY);
        case DecoratorTypes.DATE:
            return baseProperty(new DateArrayDecoratorConfigInternal(metadata), DecoratorTypes.ARRAY_DATE);
        case DecoratorTypes.DATE_TIME:
            return baseProperty(new DateTimeArrayDecoratorConfigInternal(metadata), DecoratorTypes.ARRAY_DATE_TIME);
        case DecoratorTypes.DATE_RANGE:
            return baseProperty(new DateRangeArrayDecoratorConfigInternal(metadata), DecoratorTypes.ARRAY_DATE_RANGE);
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