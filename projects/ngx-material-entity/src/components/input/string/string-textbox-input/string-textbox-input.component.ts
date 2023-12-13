/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

// eslint-disable-next-line angular/prefer-standalone-component
@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'string-textbox-input',
    templateUrl: './string-textbox-input.component.html',
    styleUrls: ['./string-textbox-input.component.scss']
})
export class StringTextboxInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.STRING_TEXTBOX, string> implements OnInit {
}