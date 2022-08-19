/* eslint-disable jsdoc/require-jsdoc */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { EntityUtilities } from '../../../../classes/entity.utilities';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { TextboxStringDecoratorConfigInternal } from '../../../../decorators/string/string-decorator-internal.data';
import { BaseEntityType } from '../../../../classes/entity.model';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'string-textbox-input',
    templateUrl: './string-textbox-input.component.html',
    styleUrls: ['./string-textbox-input.component.scss']
})
export class StringTextboxInputComponent<EntityType extends BaseEntityType> implements OnInit {

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Output()
    inputChangeEvent = new EventEmitter<void>();

    metadata!: TextboxStringDecoratorConfigInternal;

    constructor() { }

    ngOnInit(): void {
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.key, DecoratorTypes.STRING_TEXTBOX);
    }

    emitChange(): void {
        this.inputChangeEvent.emit();
    }
}