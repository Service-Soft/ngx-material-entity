import { Component, Input, OnInit } from '@angular/core';
import { BaseEntityType } from '../../../classes/entity.model';

/**
 * The base component for custom display values.
 *
 * Contains the entity for which the component gets displayed.
 */
@Component({
    selector: 'ngx-mat-entity-base-display-column-value',
    template: ''
})
export abstract class NgxMatEntityBaseDisplayColumnValueComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {

    @Input()
    entity!: EntityType;

    constructor() { }

    ngOnInit(): void {
        if (this.entity == null) {
            throw new Error('The provided entity is null');
        }
    }
}