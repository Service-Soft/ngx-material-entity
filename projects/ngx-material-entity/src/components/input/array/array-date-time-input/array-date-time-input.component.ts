/* eslint-disable jsdoc/require-jsdoc */
import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EnvironmentInjector, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DateTimeArrayDecoratorConfigInternal } from '../../../../decorators/array/array-decorator-internal.data';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DropdownValue } from '../../../../decorators/base/dropdown-value.interface';
import { NGX_INTERNAL_GLOBAL_DEFAULT_VALUES } from '../../../../default-global-configuration-values';
import { ReflectUtilities } from '../../../../encapsulation/reflect.utilities';
import { NgxGlobalDefaultValues } from '../../../../global-configuration-values';
import { DateUtilities } from '../../../../utilities/date.utilities';
import { ArrayTableComponent } from '../array-table.class';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'array-date-time-input',
    templateUrl: './array-date-time-input.component.html',
    styleUrls: ['./array-date-time-input.component.scss']
})
export class ArrayDateTimeInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends ArrayTableComponent<Date, EntityType, DecoratorTypes.ARRAY_DATE_TIME> implements OnInit {

    DateUtilities: typeof DateUtilities = DateUtilities;

    dateTime?: Date;
    time?: Time;
    timeDropdownValues!: DropdownValue<Time>[];

    constructor(
        matDialog: MatDialog,
        injector: EnvironmentInjector,
        http: HttpClient,
        @Inject(NGX_INTERNAL_GLOBAL_DEFAULT_VALUES)
        private readonly globalConfig: NgxGlobalDefaultValues
    ) {
        super(matDialog, injector, http);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.metadata = new DateTimeArrayDecoratorConfigInternal(this.metadata, this.globalConfig);
        ReflectUtilities.defineMetadata('metadata', this.metadata, this.entity, this.key);
        this.time = DateUtilities.getTimeFromDate(this.entity[this.key] as Date);
        this.timeDropdownValues = this.metadata.times;
        if (this.entity[this.key] != null) {
            this.dateTime = new Date(this.entity[this.key] as Date);
        }
    }

    protected override resetInput(): void {
        this.input = undefined;
        this.time = undefined;
    }

    /**
     * Adds a date time to the array.
     */
    addDateTime(): void {
        if (this.input && this.time) {
            this.input = new Date(this.input);
            this.input.setHours(this.time.hours, this.time.minutes, 0, 0);
            this.add();
        }
    }
}