/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { DateUtilities } from '../../../../classes/date.utilities';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { ArrayTableComponent } from '../array-table.class';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'array-date-input',
    templateUrl: './array-date-input.component.html',
    styleUrls: ['./array-date-input.component.scss']
})
export class ArrayDateInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends ArrayTableComponent<Date, EntityType, DecoratorTypes.ARRAY_DATE> implements OnInit {

    DateUtilities: typeof DateUtilities = DateUtilities;
}