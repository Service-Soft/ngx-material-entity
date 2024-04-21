/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'number-input',
    templateUrl: './number-input.component.html',
    styleUrls: ['./number-input.component.scss'],
    standalone: true,
    imports: [
        MatInputModule,
        MatFormFieldModule,
        FormsModule
    ]
})
export class NumberInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.NUMBER, number> implements OnInit {
}