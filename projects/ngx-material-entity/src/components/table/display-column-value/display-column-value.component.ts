import { Component, ComponentRef, Input, OnInit, Type, ViewContainerRef } from '@angular/core';
import { BaseEntityType } from '../../../classes/entity.model';
import { NgxMatEntityBaseDisplayColumnValueComponent } from './base-display-column-value.component';

/**
 * The component that displays the custom display column value.
 */
@Component({
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
    @Input()
    entity!: EntityType;

    /**
     * The class of the component that should be used inside the custom display column.
     */
    @Input()
    ComponentClass!: Type<NgxMatEntityBaseDisplayColumnValueComponent<EntityType>>;

    /**
     * The actual component that is used inside the custom display column.
     */
    component!: ComponentRef<NgxMatEntityBaseDisplayColumnValueComponent<EntityType>>;

    constructor(private readonly viewContainerRef: ViewContainerRef) {}

    ngOnInit(): void {
        if (this.ComponentClass == null) {
            throw new Error('No ComponentClass has been provided.');
        }
        if (this.entity == null) {
            throw new Error('No entity value has been provided.');
        }
        this.component = this.viewContainerRef.createComponent(this.ComponentClass);
        this.component.instance.entity = this.entity;
        (this.component.location.nativeElement as HTMLElement).setAttribute('style', 'width: 100%');
    }
}