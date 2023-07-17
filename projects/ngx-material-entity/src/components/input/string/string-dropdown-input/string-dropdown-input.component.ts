/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DropdownValue } from '../../../../decorators/base/dropdown-value.interface';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'string-dropdown-input',
    templateUrl: './string-dropdown-input.component.html',
    styleUrls: ['./string-dropdown-input.component.scss']
})
export class StringDropdownInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.STRING_DROPDOWN, string> implements OnInit {

    dropdownValues: DropdownValue<string | undefined>[] = [];

    override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.dropdownValues = await this.metadata.dropdownValues(this.entity);
    }
}