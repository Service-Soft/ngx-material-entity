/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DropdownValue } from '../../../../decorators/base/dropdown-value.interface';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'number-dropdown-input',
    templateUrl: './number-dropdown-input.component.html',
    styleUrls: ['./number-dropdown-input.component.scss']
})
export class NumberDropdownInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.NUMBER_DROPDOWN, number> implements OnInit {

    dropdownValues: DropdownValue<number | undefined>[] = [];

    override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.dropdownValues = await this.metadata.dropdownValues(this.entity);
    }
}