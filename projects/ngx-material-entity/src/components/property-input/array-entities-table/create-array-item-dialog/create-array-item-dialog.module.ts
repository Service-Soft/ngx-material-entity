import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateArrayItemDialogComponent } from './create-array-item-dialog.component';
import { InternalPropertyInputModule } from '../../internal-property-input/internal-property-input.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [CreateArrayItemDialogComponent],
    imports: [CommonModule, InternalPropertyInputModule, MatDialogModule, FormsModule, MatButtonModule],
    exports: [CreateArrayItemDialogComponent]
})
export class CreateArrayItemDialogModule {}