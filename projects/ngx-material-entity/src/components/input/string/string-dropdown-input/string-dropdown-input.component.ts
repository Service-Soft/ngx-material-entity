/* eslint-disable jsdoc/require-jsdoc */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { EntityUtilities } from '../../../../classes/entity.utilities';
import { DropdownStringDecoratorConfigInternal } from '../../../../decorators/string/string-decorator-internal.data';
import { NgModel } from '@angular/forms';
import { BaseEntityType } from '../../../../classes/entity.model';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'string-dropdown-input',
    templateUrl: './string-dropdown-input.component.html',
    styleUrls: ['./string-dropdown-input.component.scss']
})
export class StringDropdownInputComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Output()
    inputChangeEvent = new EventEmitter<void>();

    metadata!: DropdownStringDecoratorConfigInternal;

    constructor() { }

    ngOnInit(): void {
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.key, DecoratorTypes.STRING_DROPDOWN);
    }

    emitChange(): void {
        this.inputChangeEvent.emit();
    }
}