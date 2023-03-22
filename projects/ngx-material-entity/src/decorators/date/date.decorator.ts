import { EntityUtilities } from '../../utilities/entity.utilities';
import { baseProperty } from '../base/base-property.decorator';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { DateRangeDateDecoratorConfigInternal, DateTimeDateDecoratorConfigInternal, DefaultDateDecoratorConfigInternal } from './date-decorator-internal.data';
import { DateRangeDateDecoratorConfig, DateTimeDateDecoratorConfig, DefaultDateDecoratorConfig } from './date-decorator.data';

/**
 * Decorator for setting and getting date property metadata.
 *
 * @param metadata - The metadata of the date property.
 * @returns The method that defines the metadata.
 */
export function date(
    metadata: DefaultDateDecoratorConfig | DateRangeDateDecoratorConfig | DateTimeDateDecoratorConfig
): (target: object, propertyKey: string) => void {
    if (metadata.displayStyle === 'date') {
        return baseProperty(new DefaultDateDecoratorConfigInternal(metadata), DecoratorTypes.DATE);
    }
    else if (metadata.displayStyle === 'datetime') {
        return baseProperty(new DateTimeDateDecoratorConfigInternal(metadata), DecoratorTypes.DATE_TIME, [EntityUtilities.TIME_KEY]);
    }
    else {
        return baseProperty(
            new DateRangeDateDecoratorConfigInternal(metadata),
            DecoratorTypes.DATE_RANGE,
            [EntityUtilities.DATE_RANGE_END_KEY, EntityUtilities.DATE_RANGE_KEY, EntityUtilities.DATE_RANGE_START_KEY]
        );
    }
}