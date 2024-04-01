
/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';
@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'number-slider-input',
    templateUrl: './number-slider-input.component.html',
    styleUrls: ['./number-slider-input.component.scss'],
    standalone: true,
    imports: [
        MatSliderModule,
        MatInputModule,
        FormsModule
    ]
})
export class NumberSliderInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.NUMBER_SLIDER, number> implements OnInit {

    updatePropertyValue(value: number): void {
        this.propertyValue = value;
    }
}