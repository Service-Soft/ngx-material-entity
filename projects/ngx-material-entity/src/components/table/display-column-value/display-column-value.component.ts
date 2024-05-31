import { Component, ComponentRef, Input, OnInit, Type, ViewContainerRef } from '@angular/core';

import { NgxMatEntityBaseDisplayColumnValueComponent } from './base-display-column-value.component';
import { BaseEntityType } from '../../../classes/entity.model';

/**
 * The component that displays the custom display column value.
 */
@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'display-column-value',
    templateUrl: './display-column-value.component.html',
    styleUrls: ['./display-column-value.component.scss'],
    standalone: true,
    imports: []
})
export class DisplayColumnValueComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {

    /**
     * The entity for which the column should be displayed.
     */
    @Input({ required: true })
    entity!: EntityType;

    /**
     * The class of the component that should be used inside the custom display column.
     */
    @Input({ required: true })
    ComponentClass!: Type<NgxMatEntityBaseDisplayColumnValueComponent<EntityType>>;

    /**
     * The actual component that is used inside the custom display column.
     */
    component!: ComponentRef<NgxMatEntityBaseDisplayColumnValueComponent<EntityType>>;

    constructor(private readonly viewContainerRef: ViewContainerRef) {}

    ngOnInit(): void {
        this.component = this.viewContainerRef.createComponent(this.ComponentClass);
        this.component.instance.entity = this.entity;
        (this.component.location.nativeElement as HTMLElement).setAttribute('style', 'width: 100%');
    }
}