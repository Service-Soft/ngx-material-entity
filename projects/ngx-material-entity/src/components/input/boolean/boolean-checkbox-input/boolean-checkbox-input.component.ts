/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'boolean-checkbox-input',
    templateUrl: './boolean-checkbox-input.component.html',
    styleUrls: ['./boolean-checkbox-input.component.scss'],
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatCheckboxModule,
        FormsModule,
        MatInputModule
    ]
})
export class BooleanCheckboxInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.BOOLEAN_CHECKBOX, boolean> implements OnInit {

    updatePropertyValue(): void {
        this.propertyValue = this.propertyValue != null ? !this.propertyValue : true;
    }
}