/* eslint-disable @angular-eslint/component-selector */
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

    @Input()
    entity!: EntityType;

    @Input()
    ComponentClass!: Type<NgxMatEntityBaseDisplayColumnValueComponent<EntityType>>;

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