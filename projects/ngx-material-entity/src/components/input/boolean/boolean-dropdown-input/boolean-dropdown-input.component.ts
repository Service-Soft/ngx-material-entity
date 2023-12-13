/* eslint-disable jsdoc/require-jsdoc */
import { Component, Inject, OnInit } from '@angular/core';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DropdownBooleanDecoratorConfigInternal } from '../../../../decorators/boolean/boolean-decorator-internal.data';
import { NGX_INTERNAL_GLOBAL_DEFAULT_VALUES } from '../../../../default-global-configuration-values';
import { NgxGlobalDefaultValues } from '../../../../global-configuration-values';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

// eslint-disable-next-line angular/prefer-standalone-component
@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'boolean-dropdown-input',
    templateUrl: './boolean-dropdown-input.component.html',
    styleUrls: ['./boolean-dropdown-input.component.scss']
})
export class BooleanDropdownInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.BOOLEAN_DROPDOWN, boolean> implements OnInit {

    constructor(
        @Inject(NGX_INTERNAL_GLOBAL_DEFAULT_VALUES)
        private readonly globalConfig: NgxGlobalDefaultValues
    ) {
        super();
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.metadata = new DropdownBooleanDecoratorConfigInternal(this.metadata, this.globalConfig);
    }
}