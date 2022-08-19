/* eslint-disable jsdoc/require-jsdoc */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EntityUtilities } from '../../../../classes/entity.utilities';
import { DefaultDateDecoratorConfigInternal } from '../../../../decorators/date/date-decorator-internal.data';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { NgModel } from '@angular/forms';
import { DateUtilities } from '../../../../classes/date.utilities';
import { DateFilterFn } from '@angular/material/datepicker';
import { BaseEntityType } from '../../../../classes/entity.model';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'date-input',
    templateUrl: './date-input.component.html',
    styleUrls: ['./date-input.component.scss']
})
export class DateInputComponent<EntityType extends BaseEntityType> implements OnInit {

    DateUtilities = DateUtilities;

    @Input()
    entity!: EntityType;

    @Input()
    key!: keyof EntityType;

    @Input()
    getValidationErrorMessage!: (model: NgModel) => string;

    @Output()
    inputChangeEvent = new EventEmitter<void>();

    metadata!: DefaultDateDecoratorConfigInternal;

    constructor() { }

    defaultDateFilter: DateFilterFn<Date | null | undefined> = (): boolean => true;

    ngOnInit(): void {
        this.metadata = EntityUtilities.getPropertyMetadata(this.entity, this.key, DecoratorTypes.DATE);
    }

    emitChange(): void {
        this.inputChangeEvent.emit();
    }
}