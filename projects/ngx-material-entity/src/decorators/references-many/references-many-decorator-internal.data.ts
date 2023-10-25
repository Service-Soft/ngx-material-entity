import { BaseEntityType } from '../../classes/entity.model';
import { DisplayColumn } from '../../components/table/table-data';
import { getConfigValue } from '../../functions/get-config-value.function';
import { NgxGlobalDefaultValues } from '../../global-configuration-values';
import { DropdownValue } from '../base/dropdown-value.interface';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { ReferencesManyDecoratorConfig } from './references-many-decorator.data';

/**
 * The internal DefaultNumberDecoratorConfig. Sets default values.
 */
export class ReferencesManyDecoratorConfigInternal<EntityType extends BaseEntityType<EntityType>>
    extends PropertyDecoratorConfigInternal<EntityType> implements ReferencesManyDecoratorConfig<EntityType> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    getReferencedEntities: () => Promise<EntityType[]>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    getDropdownValues: (referencedEntities: EntityType[]) => DropdownValue<string>[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    getEntityForId: (entityId: string, allReferencedEntities: EntityType[]) => EntityType;
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayColumns: DisplayColumn<EntityType>[];
    // eslint-disable-next-line jsdoc/require-jsdoc
    addButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    removeButtonLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    dropdownLabel: string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    addAll: boolean;
    // eslint-disable-next-line jsdoc/require-jsdoc
    addAllButtonLabel: string;

    constructor(data: ReferencesManyDecoratorConfig<EntityType>, globalConfig: NgxGlobalDefaultValues) {
        super(data);
        this.getReferencedEntities = data.getReferencedEntities;
        this.getDropdownValues = data.getDropdownValues;
        this.getEntityForId = data.getEntityForId ?? defaultGetEntityForId;
        this.displayColumns = data.displayColumns;
        this.addButtonLabel = getConfigValue(globalConfig.addLabel, data.addButtonLabel);
        this.removeButtonLabel = getConfigValue(globalConfig.removeLabel, data.removeButtonLabel);
        this.defaultWidths = data.defaultWidths ?? [12, 12, 12];
        this.dropdownLabel = getConfigValue(globalConfig.selectLabel, data.dropdownLabel);
        this.addAll = data.addAll ?? false;
        this.addAllButtonLabel = getConfigValue(globalConfig.addAllLabel, data.addAllButtonLabel);
    }
}

/**
 * The default function to use when trying to get the referenced entity for the given id.
 * @param entityId - The id of the referenced entity.
 * @param allReferencedEntities - All referenced entities.
 * @returns The entity that has the given id.
 */
export function defaultGetEntityForId<EntityType extends BaseEntityType<EntityType>>(
    entityId: string,
    allReferencedEntities: EntityType[]
): EntityType {
    return allReferencedEntities.find(e => e['id' as keyof EntityType] === entityId) as EntityType;
}