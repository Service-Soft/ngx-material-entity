/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DateUtilities } from '../../../../classes/date.utilities';
import { BaseEntityType } from '../../../../classes/entity.model';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'date-input',
    templateUrl: './date-input.component.html',
    styleUrls: ['./date-input.component.scss']
})
export class DateInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.DATE, Date> implements OnInit {

    DateUtilities = DateUtilities;
}