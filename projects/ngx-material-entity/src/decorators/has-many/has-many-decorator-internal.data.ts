import { inject } from '@angular/core';
import { BaseEntityType, EntityServiceClassNewable } from '../../classes/entity.model';
import { BaseDataBuilder, BaseDataInternal, TableDataBuilder, TableDataInternal } from '../../components/table/table-data.builder';
import { NgxGlobalDefaultValues } from '../../global-configuration-values';
import { EntityService } from '../../services/entity.service';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { HasManyDecoratorConfig } from './has-many-decorator.data';

/**
 * The internal HasManyDecoratorConfig. Sets default values.
 */
export class HasManyDecoratorConfigInternal<
    EntityType extends BaseEntityType<EntityType>,
    RelatedBaseEntityType extends BaseEntityType<RelatedBaseEntityType>
> extends PropertyDecoratorConfigInternal<EntityType> implements HasManyDecoratorConfig<EntityType, RelatedBaseEntityType> {

    override omitForCreate: true;
    // eslint-disable-next-line jsdoc/require-jsdoc
    tableData: TableDataInternal<EntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    RelatedEntityServiceClass: EntityServiceClassNewable<RelatedBaseEntityType>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    createBaseUrl: (baseEntity: RelatedBaseEntityType, metadata: HasManyDecoratorConfig<EntityType, RelatedBaseEntityType>) => string;
    // eslint-disable-next-line jsdoc/require-jsdoc
    readBaseUrl: (baseEntity: RelatedBaseEntityType, metadata: HasManyDecoratorConfig<EntityType, RelatedBaseEntityType>) => string;

    constructor(data: HasManyDecoratorConfig<EntityType, RelatedBaseEntityType>, globalConfig: NgxGlobalDefaultValues) {
        super(data);
        const baseData: BaseDataInternal<EntityType> = new BaseDataBuilder(data.tableData.baseData, globalConfig)
            .withDefault('title', data.displayName)
            .getResult();
        this.tableData = new TableDataBuilder(globalConfig, data.tableData)
            .withDefault('baseData', baseData)
            .getResult();
        this.RelatedEntityServiceClass = data.RelatedEntityServiceClass;
        this.createBaseUrl = data.createBaseUrl ?? defaultCreateBaseUrl as (
            baseEntity: RelatedBaseEntityType,
            metadata: HasManyDecoratorConfig<EntityType, RelatedBaseEntityType>
        ) => string;
        this.readBaseUrl = data.readBaseUrl ?? defaultCreateBaseUrl as (
            baseEntity: RelatedBaseEntityType,
            metadata: HasManyDecoratorConfig<EntityType, RelatedBaseEntityType>
        ) => string;

        this.defaultWidths = data.defaultWidths ?? [12, 12, 12];
        this.omitForCreate = true;
    }
}

/* istanbul ignore next */
// eslint-disable-next-line jsdoc/require-jsdoc
function defaultCreateBaseUrl<EntityType extends BaseEntityType<EntityType>, RelatedBaseEntityType extends BaseEntityType<EntityType>>(
    baseEntity: RelatedBaseEntityType,
    metadata: HasManyDecoratorConfigInternal<EntityType, RelatedBaseEntityType>
): string {
    // eslint-disable-next-line max-len
    const baseEntityService: EntityService<RelatedBaseEntityType> = inject<EntityService<RelatedBaseEntityType>>(metadata.RelatedEntityServiceClass);
    const entityService: EntityService<EntityType> = inject<EntityService<EntityType>>(metadata.tableData.baseData.EntityServiceClass);
    const baseUrlSegments: string[] = entityService.baseUrl.split('/');
    return `${baseEntityService.baseUrl}/${baseEntity[baseEntityService.idKey]}/${baseUrlSegments[baseUrlSegments.length - 1]}`;
}