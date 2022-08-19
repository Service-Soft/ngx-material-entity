/* eslint-disable jsdoc/require-jsdoc */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { EntityUtilities } from '../../../../classes/entity.utilities';
import { DropdownBooleanDecoratorConfigInternal } from '../../../../decorators/boolean/boolean-decorator-internal.data';
import { NgModel } from '@angular/forms';
import { BaseEntityType } from '../../../../classes/entity.model';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'boolean-dropdown-input',
    templateUrl: './boolean-dropdown-input.component.html',
    styleUrls: ['./boolean-dropdown-input.component.scss']
})
export class BooleanDropdownInputComponent<EntityType extends BaseEntityType> implements OnInit {

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Output()
    inputChangeEvent = new EventEmitter<void>();

    metadata!: DropdownBooleanDecoratorConfigInternal;

    constructor() { }

    ngOnInit(): void {
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.key, DecoratorTypes.BOOLEAN_DROPDOWN);
    }

    emitChange(): void {
        this.inputChangeEvent.emit();
    }
}