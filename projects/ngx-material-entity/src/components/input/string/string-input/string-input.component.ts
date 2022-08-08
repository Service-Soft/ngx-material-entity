/* eslint-disable jsdoc/require-jsdoc */
import { Component, Input, OnInit } from '@angular/core';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { EntityUtilities } from '../../../../classes/entity.utilities';
import { DefaultStringDecoratorConfigInternal } from '../../../../decorators/string/string-decorator-internal.data';
import { NgModel } from '@angular/forms';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'string-input',
    templateUrl: './string-input.component.html',
    styleUrls: ['./string-input.component.scss']
})
export class StringInputComponent<EntityType extends object> implements OnInit {

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    metadata!: DefaultStringDecoratorConfigInternal;

    constructor() { }

    ngOnInit(): void {
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.key, DecoratorTypes.STRING);
    }
}