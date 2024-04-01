/* eslint-disable jsdoc/require-jsdoc */
import { NgFor, NgIf, Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EnvironmentInjector, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DateTimeArrayDecoratorConfigInternal } from '../../../../decorators/array/array-decorator-internal.data';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { DropdownValue } from '../../../../decorators/base/dropdown-value.interface';
import { ReflectUtilities } from '../../../../encapsulation/reflect.utilities';
import { NGX_COMPLETE_GLOBAL_DEFAULT_VALUES, NgxGlobalDefaultValues } from '../../../../global-configuration-values';
import { DateUtilities } from '../../../../utilities/date.utilities';
import { ArrayTableComponent } from '../array-table.class';
@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'array-date-time-input',
    templateUrl: './array-date-time-input.component.html',
    styleUrls: ['./array-date-time-input.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        MatFormFieldModule,
        FormsModule,
        MatDatepickerModule,
        MatSelectModule,
        MatTableModule,
        MatCheckboxModule,
        MatInputModule,
        MatButtonModule,
        NgFor
    ]
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
        @Inject(NGX_COMPLETE_GLOBAL_DEFAULT_VALUES)
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