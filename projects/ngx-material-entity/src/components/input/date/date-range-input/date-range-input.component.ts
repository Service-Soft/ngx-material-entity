/* eslint-disable jsdoc/require-jsdoc */
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateFilterFn, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BaseEntityType } from '../../../../classes/entity.model';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DateRangeDateDecoratorConfigInternal } from '../../../../decorators/date/date-decorator-internal.data';
import { DateRange } from '../../../../decorators/date/date-decorator.data';
import { ReflectUtilities } from '../../../../encapsulation/reflect.utilities';
import { NGX_COMPLETE_GLOBAL_DEFAULT_VALUES, NgxGlobalDefaultValues } from '../../../../global-configuration-values';
import { DateUtilities } from '../../../../utilities/date.utilities';
import { NgxMatEntityBaseInputComponent } from '../../base-input.component';

@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'date-range-input',
    templateUrl: './date-range-input.component.html',
    styleUrls: ['./date-range-input.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatDatepickerModule,
        FormsModule
    ]
})
export class DateRangeInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends NgxMatEntityBaseInputComponent<EntityType, DecoratorTypes.DATE_RANGE, DateRange> implements OnInit {

    dateRangeStart?: Date;
    dateRangeEnd?: Date;

    defaultDateFilter: DateFilterFn<Date | null | undefined> = DateUtilities.defaultDateFilter;

    constructor(
        @Inject(NGX_COMPLETE_GLOBAL_DEFAULT_VALUES)
        private readonly globalConfig: NgxGlobalDefaultValues
    ) {
        super();
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.metadata = new DateRangeDateDecoratorConfigInternal(this.metadata, this.globalConfig);
        ReflectUtilities.defineMetadata('metadata', this.metadata, this.entity, this.key);
        // this.dateRange = LodashUtilities.cloneDeep(this.propertyValue) ?? EMPTY_DATERANGE;
        if (this.propertyValue?.start) {
            this.dateRangeStart = new Date(this.propertyValue.start);
        }
        if (this.propertyValue?.end) {
            this.dateRangeEnd = new Date(this.propertyValue.end);
        }
        this.setDateRangeValues();
    }

    /**
     * Updates the date range values based on the start and end date.
     */
    setDateRangeValues(): void {
        if (this.dateRangeStart && this.dateRangeEnd) {
            const values: Date[] = DateUtilities.getDatesBetween(
                new Date(this.dateRangeStart),
                new Date(this.dateRangeEnd),
                this.metadata.filter
            );
            this.propertyValue = {
                start: new Date(this.dateRangeStart),
                end: new Date(this.dateRangeEnd),
                values: values.length ? values : (undefined as unknown as Date[])
            };
        }
        else if (!this.dateRangeStart && !this.dateRangeEnd) {
            this.propertyValue = undefined;
        }
        else if (this.dateRangeStart) {
            this.propertyValue = {
                start: new Date(this.dateRangeStart),
                end: undefined as unknown as Date,
                values: undefined as unknown as Date[]
            };
        }
        else if (this.dateRangeEnd) {
            this.propertyValue = {
                start: undefined as unknown as Date,
                end: new Date(this.dateRangeEnd),
                values: undefined as unknown as Date[]
            };
        }
        this.emitChange();
    }
}