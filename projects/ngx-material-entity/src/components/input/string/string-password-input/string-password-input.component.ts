/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { BaseEntityType } from '../../../../classes/entity.model';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';
import { ReflectUtilities } from '../../../../encapsulation/reflect.utilities';
import { LodashUtilities } from '../../../../encapsulation/lodash.utilities';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'string-password-input',
    templateUrl: './string-password-input.component.html',
    styleUrls: ['./string-password-input.component.scss']
})
export class StringPasswordInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.STRING_PASSWORD, string> implements OnInit {

    hide = true;
    hideConfirm = true;

    confirmRequired!: boolean;
    confirmPassword?: string;

    override ngOnInit(): void {
        super.ngOnInit();
        this.confirmRequired = this.metadata.required;
        this.confirmPassword = LodashUtilities.cloneDeep(this.propertyValue);
        ReflectUtilities.defineMetadata('confirmPassword', this.confirmPassword, this.entity, this.key);
    }

    passwordInput(): void {
        this.confirmRequired = Boolean(this.propertyValue);
        ReflectUtilities.defineMetadata('confirmPassword', this.confirmPassword, this.entity, this.key);
        this.emitChange();
    }
}