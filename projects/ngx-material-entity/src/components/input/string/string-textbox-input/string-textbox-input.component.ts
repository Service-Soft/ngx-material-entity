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
    selector: 'string-textbox-input',
    templateUrl: './string-textbox-input.component.html',
    styleUrls: ['./string-textbox-input.component.scss'],
    standalone: true,
    imports: [
        MatFormFieldModule,
        FormsModule,
        MatInputModule
    ]
})
export class StringTextboxInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.STRING_TEXTBOX, string> implements OnInit {
}