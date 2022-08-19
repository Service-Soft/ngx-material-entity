/* eslint-disable jsdoc/require-jsdoc */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { EntityUtilities } from '../../../../classes/entity.utilities';
import { DefaultNumberDecoratorConfigInternal } from '../../../../decorators/number/number-decorator-internal.data';
import { NgModel } from '@angular/forms';
import { BaseEntityType } from '../../../../classes/entity.model';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'number-input',
    templateUrl: './number-input.component.html',
    styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent<EntityType extends BaseEntityType> implements OnInit {

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Output()
    inputChangeEvent = new EventEmitter<void>();

    metadata!: DefaultNumberDecoratorConfigInternal;

    constructor() { }

    ngOnInit(): void {
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.key, DecoratorTypes.NUMBER);
    }

    emitChange(): void {
        this.inputChangeEvent.emit();
    }
}