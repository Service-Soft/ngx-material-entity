import { BaseEntityType, EntityClassNewable } from '../../classes/entity.model';
import { DropdownValue } from '../base/dropdown-value.interface';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { defaultGetEntityForId } from '../references-many/references-many-decorator-internal.data';
import { ReferencesOneDecoratorConfig } from './references-one-decorator.data';

/**
 * The internal DefaultNumberDecoratorConfig. Sets default values.
 */
export class ReferencesOneDecoratorConfigInternal<EntityType extends BaseEntityType<EntityType>>
    extends PropertyDecoratorConfigInternal implements ReferencesOneDecoratorConfig<EntityType> {

    // eslint-disable-next-line jsdoc/require-jsdoc
    getReferencedEntities: () => Promise<EntityType[]>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    getDropdownValues: (referencedEntities: EntityType[]) => DropdownValue<string>[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    getEntityForId: (entityId: string, allReferencedEntities: EntityType[]) => EntityType;
    // eslint-disable-next-line jsdoc/require-jsdoc
    EntityClass: EntityClassNewable<EntityType>;

    constructor(data: ReferencesOneDecoratorConfig<EntityType>) {
        super(data);
        this.getReferencedEntities = data.getReferencedEntities;
        this.getDropdownValues = data.getDropdownValues;
        this.getEntityForId = data.getEntityForId ?? defaultGetEntityForId;
        this.EntityClass = data.EntityClass;
        this.defaultWidths = data.defaultWidths ?? [12, 12, 12];
    }
}