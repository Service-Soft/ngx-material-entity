import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { NgxMatEntityArrayTableComponent } from './array-table.component';
import { NgxMatEntityInternalInputModule } from '../internal-input/internal-input.module';
import { MatButtonModule } from '@angular/material/button';
import { NgxMatEntityAddArrayItemDialogModule } from './add-array-item-dialog/add-array-item-dialog.module';

@NgModule({
    declarations: [NgxMatEntityArrayTableComponent],
    imports: [
        CommonModule,
        MatInputModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatTableModule,
        NgxMatEntityInternalInputModule,
        MatButtonModule,
        NgxMatEntityAddArrayItemDialogModule
    ],
    exports: [NgxMatEntityArrayTableComponent]
})
export class NgxMatEntityArrayTableModule {}