import { BaseEntityType, EntityClassNewable } from '../../classes/entity.model';
import { DropdownValue } from '../base/dropdown-value.interface';
import { PropertyDecoratorConfig } from '../base/property-decorator.data';

/**
 * Definition for the @referencesOne metadata.
 */
export interface ReferencesOneDecoratorConfig<EntityType extends BaseEntityType<EntityType>> extends PropertyDecoratorConfig<EntityType> {
    /**
     * The function that returns the values that can be possibly referenced.
     */
    getReferencedEntities: () => Promise<EntityType[]>,

    /**
     * Method to filter or add dropdown options eg, for an empty value.
     */
    getDropdownValues: (referencedEntities: EntityType[]) => DropdownValue<string>[],

    /**
     * Gets the referenced entity for the given id.
     */
    getEntityForId?: (entityId: string, allReferencedEntities: EntityType[]) => EntityType,

    /**
     * The class of the entity that gets referenced.
     */
    EntityClass: EntityClassNewable<EntityType>
}