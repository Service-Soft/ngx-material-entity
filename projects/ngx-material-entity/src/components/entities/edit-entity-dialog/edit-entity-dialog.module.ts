import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditEntityDialogComponent } from './edit-entity-dialog.component';
import { PropertyInputModule } from '../../property-input/property-input.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogModule } from '../../confirm-dialog/confirm-dialog.module';

@NgModule({
    declarations: [EditEntityDialogComponent],
    imports: [CommonModule, PropertyInputModule, MatDialogModule, FormsModule, MatButtonModule, ConfirmDialogModule],
    exports: [EditEntityDialogComponent]
})
export class EditEntityDialogModule {}