/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { LodashUtilities } from '../../../../encapsulation/lodash.utilities';
import { ReflectUtilities } from '../../../../encapsulation/reflect.utilities';
import { EntityUtilities } from '../../../../utilities/entity.utilities';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

// eslint-disable-next-line angular/prefer-standalone-component
@Component({
    selector: 'string-password-input',
    templateUrl: './string-password-input.component.html',
    styleUrls: ['./string-password-input.component.scss']
})
export class StringPasswordInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.STRING_PASSWORD, string> implements OnInit {

    hide: boolean = true;
    hideConfirm: boolean = true;

    confirmRequired: boolean = false;

    get confirmPassword(): string | undefined {
        return ReflectUtilities.getMetadata(EntityUtilities.CONFIRM_PASSWORD_KEY, this.entity, this.key) as string | undefined;
    }

    set confirmPassword(value: string | undefined) {
        ReflectUtilities.defineMetadata(EntityUtilities.CONFIRM_PASSWORD_KEY, value, this.entity, this.key);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.confirmRequired = Boolean(this.propertyValue);
        this.confirmPassword = LodashUtilities.cloneDeep(this.propertyValue);
    }

    passwordInput(): void {
        this.confirmRequired = Boolean(this.propertyValue);
        this.emitChange();
    }
}