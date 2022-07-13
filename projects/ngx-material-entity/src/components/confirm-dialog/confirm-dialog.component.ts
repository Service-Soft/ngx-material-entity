import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogData } from './confirm-dialog-data';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from './confirm-dialog-data.builder';

@Component({
    selector: 'ngx-mat-entity-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class NgxMatEntityConfirmDialogComponent implements OnInit {

    confirm = false;

    data!: ConfirmDialogDataInternal;

    constructor(
        private readonly dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        private readonly inputData: ConfirmDialogData
    ) {}

    ngOnInit(): void {
        this.data = new ConfirmDialogDataBuilder(this.inputData).getResult();
        this.dialogRef.disableClose = true;
    }

    /**
     * Closes the dialog with value 1 to signal that the action should be run.
     */
    confirmAction(): void {
        this.dialogRef.close(1);
    }

    /**
     * Closes the dialog.
     */
    cancel(): void {
        this.dialogRef.close();
    }
}