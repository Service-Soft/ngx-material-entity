import { Component, Input } from '@angular/core';

import { BaseEntityType } from '../../../classes/entity.model';

/**
 * The base component for custom display values.
 *
 * Contains the entity for which the component gets displayed.
 */
// eslint-disable-next-line angular/prefer-standalone
@Component({
    selector: 'ngx-mat-entity-base-display-column-value',
    template: ''
})
export abstract class NgxMatEntityBaseDisplayColumnValueComponent<EntityType extends BaseEntityType<EntityType>> {
    /**
     * The entity for which the component gets displayed.
     */
    @Input({ required: true })
    entity!: EntityType;
}