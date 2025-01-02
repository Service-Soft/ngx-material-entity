import { ReferencesOneDecoratorConfig } from './references-one-decorator.data';
import { BaseEntityType, EntityClassNewable } from '../../classes/entity.model';
import { DropdownValue } from '../base/dropdown-value.interface';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { Col } from '../base/property-decorator.data';
import { defaultGetEntityForId } from '../references-many/references-many-decorator-internal.data';

/**
 * The internal DefaultNumberDecoratorConfig. Sets default values.
 */
export class ReferencesOneDecoratorConfigInternal<EntityType extends BaseEntityType<EntityType>>
    extends PropertyDecoratorConfigInternal<EntityType> implements ReferencesOneDecoratorConfig<EntityType> {

    // eslint-disable-next-line jsdoc/require-jsdoc
    getReferencedEntities: () => Promise<EntityType[]>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    getDropdownValues: (referencedEntities: EntityType[]) => DropdownValue<string>[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    getEntityForId: (entityId: string, allReferencedEntities: EntityType[]) => EntityType;
    // eslint-disable-next-line jsdoc/require-jsdoc
    EntityClass: EntityClassNewable<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    dropdownOnly: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    omit: (keyof EntityType)[];

    constructor(data: ReferencesOneDecoratorConfig<EntityType>) {
        super(data);
        this.getReferencedEntities = data.getReferencedEntities;
        this.getDropdownValues = data.getDropdownValues;
        this.getEntityForId = data.getEntityForId ?? defaultGetEntityForId;
        this.EntityClass = data.EntityClass;
        this.dropdownOnly = data.dropdownOnly ?? false;
        this.defaultWidths = data.defaultWidths ?? getDefaultWidths(this.dropdownOnly);
        this.omit = data.omit ?? [];
    }
}

// eslint-disable-next-line jsdoc/require-jsdoc
function getDefaultWidths(dropdownOnly: boolean): [Col, Col, Col] {
    return dropdownOnly ? [6, 6, 12] : [12, 12, 12];
}