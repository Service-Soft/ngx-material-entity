/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

// eslint-disable-next-line angular/prefer-standalone-component
@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'boolean-checkbox-input',
    templateUrl: './boolean-checkbox-input.component.html',
    styleUrls: ['./boolean-checkbox-input.component.scss']
})
export class BooleanCheckboxInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.BOOLEAN_CHECKBOX, boolean> implements OnInit {

    updatePropertyValue(): void {
        this.propertyValue = this.propertyValue != null ? !this.propertyValue : true;
    }
}