import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMatEntityEditDialogComponent } from './edit-entity-dialog.component';
import { NgxMatEntityInputModule } from '../../input/input.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgxMatEntityConfirmDialogModule } from '../../confirm-dialog/confirm-dialog.module';

@NgModule({
    declarations: [ NgxMatEntityEditDialogComponent],
    imports: [
        CommonModule,
        NgxMatEntityInputModule,
        MatDialogModule,
        FormsModule,
        MatButtonModule,
        NgxMatEntityConfirmDialogModule
    ],
    exports: [ NgxMatEntityEditDialogComponent]
})
export class NgxMatEntityEditDialogModule {}