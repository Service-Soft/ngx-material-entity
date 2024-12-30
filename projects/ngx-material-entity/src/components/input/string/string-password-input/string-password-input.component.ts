/* eslint-disable jsdoc/require-jsdoc */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { PasswordMatchValidatorDirective } from '../../../../directives/password-match.directive';
import { LodashUtilities } from '../../../../encapsulation/lodash.utilities';
import { ReflectUtilities } from '../../../../encapsulation/reflect.utilities';
import { EntityUtilities } from '../../../../utilities/entity.utilities';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

export enum PasswordStrength {
    WEAK = 'weak',
    MEDIUM = 'medium',
    STRONG = 'strong'
}
@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'string-password-input',
    templateUrl: './string-password-input.component.html',
    styleUrls: ['./string-password-input.component.scss'],
    standalone: true,
    imports: [
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        CommonModule,
        MatButtonModule,
        PasswordMatchValidatorDirective,
        FaIconComponent
    ]
})
export class StringPasswordInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.STRING_PASSWORD, string> implements OnInit {

    faEye: IconDefinition = faEye;
    faEyeSlash: IconDefinition = faEyeSlash;

    hide: boolean = true;
    hideConfirm: boolean = true;

    confirmRequired: boolean = false;

    passwordStrength?: PasswordStrength;

    PasswordStrength: typeof PasswordStrength = PasswordStrength;

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
        this.setPasswordStrength();
        this.emitChange();
    }

    private setPasswordStrength(): void {
        if (this.isPasswordStrong()) {
            this.passwordStrength = PasswordStrength.STRONG;
            return;
        }
        if (this.isPasswordMedium()) {
            this.passwordStrength = PasswordStrength.MEDIUM;
            return;
        }
        if (this.isPasswordWeak()) {
            this.passwordStrength = PasswordStrength.WEAK;
            return;
        }
        this.passwordStrength = undefined;
    }

    // long AND complex
    private isPasswordStrong(): boolean {
        if (!this.propertyValue) {
            return false;
        }
        return this.propertyValue?.length >= 15 && this.isPasswordComplex();
    }

    // long OR complex
    private isPasswordMedium(): boolean {
        if (!this.propertyValue) {
            return false;
        }
        return this.propertyValue?.length >= 15 || this.isPasswordComplex();
    }

    // exists
    private isPasswordWeak(): boolean {
        return !!this.propertyValue;
    }

    private isPasswordComplex(): boolean {
        if (!this.propertyValue) {
            return false;
        }
        return /[A-Z]/g.test(this.propertyValue)
            && /[a-z]/g.test(this.propertyValue)
            && /\d/g.test(this.propertyValue)
            && /[!"#$%&()*,.:<>?@^{|}]/.test(this.propertyValue);
    }
}