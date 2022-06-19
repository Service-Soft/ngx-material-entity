import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyInputComponent } from './property-input.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
    declarations: [
        PropertyInputComponent
    ],
    imports: [
        CommonModule,
        MatInputModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatSlideToggleModule
    ],
    exports: [
        PropertyInputComponent
    ]
})
export class PropertyInputModule { }
