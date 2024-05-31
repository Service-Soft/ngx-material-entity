/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'boolean-toggle-input',
    templateUrl: './boolean-toggle-input.component.html',
    styleUrls: ['./boolean-toggle-input.component.scss'],
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatSlideToggleModule,
        FormsModule,
        MatInputModule
    ]
})
export class BooleanToggleInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.BOOLEAN_TOGGLE, boolean> implements OnInit {

    updatePropertyValue(): void {
        this.propertyValue = this.propertyValue != undefined ? !this.propertyValue : true;
    }
}