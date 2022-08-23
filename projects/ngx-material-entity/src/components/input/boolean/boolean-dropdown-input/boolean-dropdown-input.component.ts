/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { BaseEntityType } from '../../../../classes/entity.model';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'boolean-dropdown-input',
    templateUrl: './boolean-dropdown-input.component.html',
    styleUrls: ['./boolean-dropdown-input.component.scss']
})
export class BooleanDropdownInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.BOOLEAN_DROPDOWN> implements OnInit {
}