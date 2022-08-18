/* eslint-disable jsdoc/require-jsdoc */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { EntityUtilities } from '../../../../classes/entity.utilities';
import { CheckboxBooleanDecoratorConfigInternal } from '../../../../decorators/boolean/boolean-decorator-internal.data';
import { NgModel } from '@angular/forms';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'boolean-checkbox-input',
    templateUrl: './boolean-checkbox-input.component.html',
    styleUrls: ['./boolean-checkbox-input.component.scss']
})
export class BooleanCheckboxInputComponent<EntityType extends object> implements OnInit {

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Output()
    inputChangeEvent = new EventEmitter<void>();

    metadata!: CheckboxBooleanDecoratorConfigInternal;

    constructor() { }

    ngOnInit(): void {
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.key, DecoratorTypes.BOOLEAN_CHECKBOX);
        if (this.entity[this.key] == null) {
            (this.entity[this.key] as unknown as boolean) = false;
        }
    }

    emitChange(): void {
        this.inputChangeEvent.emit();
    }
}