import { DefaultObjectDecoratorConfig, DropdownObjectDecoratorConfig } from './object-decorator.data';
import { BaseEntityType, EntityClassNewable } from '../../classes/entity.model';
import { dropdownValuesToFunction } from '../../functions/dropdown-values-to-function.function';
import { DropdownValue } from '../base/dropdown-value.interface';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';

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

/**
 * The internal DropdownObjectDecoratorConfig. Sets default values.
 */
export class DropdownObjectDecoratorConfigInternal<EntityType extends BaseEntityType<EntityType>>
    extends PropertyDecoratorConfigInternal<EntityType> implements DropdownObjectDecoratorConfig<EntityType> {

    // eslint-disable-next-line jsdoc/require-jsdoc
    displayStyle: 'dropdown';
    // eslint-disable-next-line jsdoc/require-jsdoc
    EntityClass: EntityClassNewable<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    omit: (keyof EntityType)[];
    // eslint-disable-next-line jsdoc/require-jsdoc, typescript/no-explicit-any
    dropdownValues: ((entity: any) => Promise<DropdownValue<EntityType | undefined>[]>);

    constructor(data: DropdownObjectDecoratorConfig<EntityType>) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.EntityClass = data.EntityClass;
        this.dropdownValues = dropdownValuesToFunction(data.dropdownValues);
        this.omit = data.omit ?? [];
        this.defaultWidths = data.defaultWidths ?? [6, 6, 12];
    }
}