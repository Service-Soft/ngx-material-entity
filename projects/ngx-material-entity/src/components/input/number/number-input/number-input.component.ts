/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

// eslint-disable-next-line angular/prefer-standalone-component
@Component({
    selector: 'number-input',
    templateUrl: './number-input.component.html',
    styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.NUMBER, number> implements OnInit {
}