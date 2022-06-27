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
import { ArrayEntitiesTableComponent } from './array-entities-table.component';
import { InternalPropertyInputModule } from '../internal-property-input/internal-property-input.module';
import { MatButtonModule } from '@angular/material/button';
import { CreateArrayItemDialogModule } from './create-array-item-dialog/create-array-item-dialog.module';

@NgModule({
    declarations: [ArrayEntitiesTableComponent],
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
        InternalPropertyInputModule,
        MatButtonModule,
        CreateArrayItemDialogModule
    ],
    exports: [ArrayEntitiesTableComponent]
})
export class ArrayEntitiesTableModule {}