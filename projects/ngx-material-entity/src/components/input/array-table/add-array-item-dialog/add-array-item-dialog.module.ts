import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMatEntityAddArrayItemDialogComponent } from './add-array-item-dialog.component';
import { NgxMatEntityInternalInputModule } from '../../internal-input/internal-input.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [NgxMatEntityAddArrayItemDialogComponent],
    imports: [CommonModule, NgxMatEntityInternalInputModule, MatDialogModule, FormsModule, MatButtonModule],
    exports: [NgxMatEntityAddArrayItemDialogComponent]
})
export class NgxMatEntityAddArrayItemDialogModule {}