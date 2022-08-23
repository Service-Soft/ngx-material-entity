/* eslint-disable jsdoc/require-jsdoc */
import { Component, ComponentRef, OnInit, Type, ViewContainerRef } from '@angular/core';
import { BaseEntityType } from '../../../classes/entity.model';
import { DecoratorTypes } from '../../../decorators/base/decorator-types.enum';
import { NgxMatEntityBaseInputComponent } from '../base-input.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'custom-input',
    templateUrl: './custom.component.html',
    styleUrls: ['./custom.component.scss']
})
export class CustomInputComponent<
    EntityType extends BaseEntityType<EntityType>,
    MetadataType extends BaseEntityType<MetadataType>,
    ComponentType extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.CUSTOM, MetadataType>
> extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.CUSTOM> implements OnInit {

    component!: ComponentRef<ComponentType>;

    constructor(private readonly viewContainerRef: ViewContainerRef) {
        super();
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.component = this.viewContainerRef.createComponent<ComponentType>(this.metadata.component as Type<ComponentType>);
        this.component.instance.entity = this.entity;
        this.component.instance.key = this.key;
        this.component.instance.getValidationErrorMessage = this.getValidationErrorMessage;
        this.component.instance.inputChangeEvent.subscribe(this.inputChangeEvent);
    }
}