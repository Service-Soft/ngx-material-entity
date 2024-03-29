import { BaseEntityType } from '../../classes/entity.model';
import { needsUpdateGlobalDefaults } from '../../default-global-configuration-values';
import { baseProperty } from '../base/base-property.decorator';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { AutocompleteStringChipsArrayDecoratorConfigInternal, DateArrayDecoratorConfigInternal, DateRangeArrayDecoratorConfigInternal, DateTimeArrayDecoratorConfigInternal, EntityArrayDecoratorConfigInternal, StringChipsArrayDecoratorConfigInternal } from './array-decorator-internal.data';
import { AutocompleteStringChipsArrayDecoratorConfig, DateArrayDecoratorConfig, DateRangeArrayDecoratorConfig, DateTimeArrayDecoratorConfig, EntityArrayDecoratorConfig, StringChipsArrayDecoratorConfig } from './array-decorator.data';

/**
 * Decorator for setting and getting array property metadata.
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
            return baseProperty(new EntityArrayDecoratorConfigInternal(metadata, needsUpdateGlobalDefaults), DecoratorTypes.ARRAY);
        case DecoratorTypes.DATE:
            return baseProperty(new DateArrayDecoratorConfigInternal(metadata, needsUpdateGlobalDefaults), DecoratorTypes.ARRAY_DATE);
        case DecoratorTypes.DATE_TIME:
            return baseProperty(
                new DateTimeArrayDecoratorConfigInternal(metadata, needsUpdateGlobalDefaults),
                DecoratorTypes.ARRAY_DATE_TIME
            );
        case DecoratorTypes.DATE_RANGE:
            return baseProperty(
                new DateRangeArrayDecoratorConfigInternal(metadata, needsUpdateGlobalDefaults),
                DecoratorTypes.ARRAY_DATE_RANGE
            );
        case DecoratorTypes.STRING:
            return baseProperty(
                new StringChipsArrayDecoratorConfigInternal(metadata, needsUpdateGlobalDefaults),
                DecoratorTypes.ARRAY_STRING_CHIPS
            );
        case DecoratorTypes.STRING_AUTOCOMPLETE:
            return baseProperty(
                new AutocompleteStringChipsArrayDecoratorConfigInternal(metadata, needsUpdateGlobalDefaults),
                DecoratorTypes.ARRAY_STRING_AUTOCOMPLETE_CHIPS
            );
        default:
            // eslint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-member-access
            throw new Error(`Unknown itemType ${(metadata as any).itemType}`);
    }
}