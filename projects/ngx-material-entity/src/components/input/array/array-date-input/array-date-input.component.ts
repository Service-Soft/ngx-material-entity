/* eslint-disable jsdoc/require-jsdoc */
import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EnvironmentInjector, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BaseEntityType } from '../../../../classes/entity.model';
import { DateArrayDecoratorConfigInternal } from '../../../../decorators/array/array-decorator-internal.data';
import { DecoratorTypes } from '../../../../decorators/base/decorator-types.enum';
import { ReflectUtilities } from '../../../../encapsulation/reflect.utilities';
import { NGX_COMPLETE_GLOBAL_DEFAULT_VALUES, NgxGlobalDefaultValues } from '../../../../global-configuration-values';
import { DateUtilities } from '../../../../utilities/date.utilities';
import { ArrayTableComponent } from '../array-table.class';
@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'array-date-input',
    templateUrl: './array-date-input.component.html',
    styleUrls: ['./array-date-input.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        MatFormFieldModule,
        FormsModule,
        MatDatepickerModule,
        MatTableModule,
        MatCheckboxModule,
        MatInputModule,
        NgFor,
        MatButtonModule
    ]
})
export class ArrayDateInputComponent<EntityType extends BaseEntityType<EntityType>>
    extends ArrayTableComponent<Date, EntityType, DecoratorTypes.ARRAY_DATE> implements OnInit {

    DateUtilities: typeof DateUtilities = DateUtilities;

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
        this.metadata = new DateArrayDecoratorConfigInternal(this.metadata, this.globalConfig);
        ReflectUtilities.defineMetadata('metadata', this.metadata, this.entity, this.key);
    }
}