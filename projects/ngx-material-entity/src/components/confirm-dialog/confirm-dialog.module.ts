import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgxMatEntityConfirmDialogComponent } from './confirm-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
    declarations: [NgxMatEntityConfirmDialogComponent],
    imports: [CommonModule, MatDialogModule, FormsModule, MatCheckboxModule, MatButtonModule],
    exports: [NgxMatEntityConfirmDialogComponent]
})
export class NgxMatEntityConfirmDialogModule {}