/* eslint-disable jsdoc/require-jsdoc */
import { Component, Input, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { EntityUtilities } from '../../../../classes/entity.utilities';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { TextboxStringDecoratorConfigInternal } from '../../../../decorators/string/string-decorator-internal.data';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'string-textbox-input',
    templateUrl: './string-textbox-input.component.html',
    styleUrls: ['./string-textbox-input.component.scss']
})
export class StringTextboxInputComponent<EntityType extends object> implements OnInit {

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    metadata!: TextboxStringDecoratorConfigInternal;

    constructor() { }

    ngOnInit(): void {
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.key, DecoratorTypes.STRING_TEXTBOX);
    }
}