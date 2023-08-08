import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { DisplayColumnValueComponent } from '../table/display-column-value/display-column-value.component';
import { ArrayDateInputComponent } from './array/array-date-input/array-date-input.component';
import { ArrayDateRangeInputComponent } from './array/array-date-range-input/array-date-range-input.component';
import { ArrayDateTimeInputComponent } from './array/array-date-time-input/array-date-time-input.component';
import { ArrayStringAutocompleteChipsComponent } from './array/array-string-autocomplete-chips/array-string-autocomplete-chips.component';
import { ArrayStringChipsInputComponent } from './array/array-string-chips-input/array-string-chips-input.component';
import { BooleanCheckboxInputComponent } from './boolean/boolean-checkbox-input/boolean-checkbox-input.component';
import { BooleanDropdownInputComponent } from './boolean/boolean-dropdown-input/boolean-dropdown-input.component';
import { BooleanToggleInputComponent } from './boolean/boolean-toggle-input/boolean-toggle-input.component';
import { CustomInputComponent } from './custom/custom.component';
import { DateInputComponent } from './date/date-input/date-input.component';
import { DateRangeInputComponent } from './date/date-range-input/date-range-input.component';
import { DateTimeInputComponent } from './date/date-time-input/date-time-input.component';
import { FileDefaultInputComponent } from './file/file-default-input/file-default-input.component';
import { FileImageInputComponent } from './file/file-image-input/file-image-input.component';
import { DragDropDirective } from './file/file-input/dragDrop.directive';
import { FileInputComponent } from './file/file-input/file-input.component';
import { NgxMatEntityInputComponent } from './input.component';
import { NumberDropdownInputComponent } from './number/number-dropdown-input/number-dropdown-input.component';
import { NumberInputComponent } from './number/number-input/number-input.component';
import { NumberSliderInputComponent } from './number/number-slider-input/number-slider-input.component';
import { ReferencesManyInputComponent } from './relations/references-many-input/references-many-input.component';
import { StringAutocompleteInputComponent } from './string/string-autocomplete-input/string-autocomplete-input.component';
import { StringDropdownInputComponent } from './string/string-dropdown-input/string-dropdown-input.component';
import { StringInputComponent } from './string/string-input/string-input.component';
import { StringPasswordInputComponent } from './string/string-password-input/string-password-input.component';
import { StringTextboxInputComponent } from './string/string-textbox-input/string-textbox-input.component';

@NgModule({
    declarations: [
        StringInputComponent,
        StringTextboxInputComponent,
        StringAutocompleteInputComponent,
        StringDropdownInputComponent,
        StringPasswordInputComponent,
        BooleanCheckboxInputComponent,
        BooleanToggleInputComponent,
        BooleanDropdownInputComponent,
        NumberInputComponent,
        NumberDropdownInputComponent,
        NumberSliderInputComponent,
        ArrayStringChipsInputComponent,
        ArrayStringAutocompleteChipsComponent,
        DateInputComponent,
        DateRangeInputComponent,
        DateTimeInputComponent,
        ArrayDateInputComponent,
        ArrayDateTimeInputComponent,
        ArrayDateRangeInputComponent,
        FileInputComponent,
        FileImageInputComponent,
        FileDefaultInputComponent,
        DragDropDirective,
        ReferencesManyInputComponent,
        CustomInputComponent,
        NgxMatEntityInputComponent
    ],
    imports: [
        CommonModule,
        MatInputModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatChipsModule,
        MatIconModule,
        MatTableModule,
        MatDialogModule,
        MatButtonModule,
        MatDatepickerModule,
        MatSliderModule,
        MatTabsModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        DisplayColumnValueComponent
    ],
    exports: [NgxMatEntityInputComponent]
})
export class NgxMatEntityInputModule {}