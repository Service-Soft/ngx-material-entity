/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { BaseEntityType } from '../../../../classes/entity.model';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'boolean-toggle-input',
    templateUrl: './boolean-toggle-input.component.html',
    styleUrls: ['./boolean-toggle-input.component.scss']
})
export class BooleanToggleInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.BOOLEAN_TOGGLE, boolean> implements OnInit {

    override ngOnInit(): void {
        super.ngOnInit();
        this.propertyValue = this.propertyValue ?? false;
    }
}