import { BaseEntityType, EntityClassNewable } from '../../classes/entity.model';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { DefaultObjectDecoratorConfig } from './object-decorator.data';

/**
 * The internal DefaultObjectDecoratorConfig. Sets default values.
 */
export class DefaultObjectDecoratorConfigInternal<EntityType extends BaseEntityType<EntityType>>
    extends PropertyDecoratorConfigInternal<EntityType> implements DefaultObjectDecoratorConfig<EntityType> {

    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'inline';
    // eslint-disable-next-line jsdoc/require-jsdoc
    EntityClass: EntityClassNewable<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    omit: (keyof EntityType)[];

    constructor(data: DefaultObjectDecoratorConfig<EntityType>) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.EntityClass = data.EntityClass;
        this.omit = data.omit ?? [];
        this.defaultWidths = data.defaultWidths ?? [12, 12, 12];
    }
}