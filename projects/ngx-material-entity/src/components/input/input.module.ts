import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMatEntityInputComponent } from './input.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMatEntityArrayTableModule } from './array-table/array-table.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [NgxMatEntityInputComponent],
    imports: [
        CommonModule,
        MatInputModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        NgxMatEntityArrayTableModule,
        MatChipsModule,
        MatIconModule
    ],
    exports: [NgxMatEntityInputComponent]
})
export class NgxMatEntityInputModule {}