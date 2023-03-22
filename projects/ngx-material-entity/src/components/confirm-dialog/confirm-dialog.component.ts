import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogData } from './confirm-dialog-data';
import { ConfirmDialogDataBuilder, ConfirmDialogDataInternal } from './confirm-dialog-data.builder';

/**
 * The Dialog used whenever confirmation by the user is required (e.g. When the user tries to delete an entity).
 *
 * Can be customized with the MAT_DIALOG_DATA "inputData". Customization options are defined in "ConfirmDialogData".
 */
@Component({
    selector: 'ngx-mat-entity-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class NgxMatEntityConfirmDialogComponent implements OnInit {

    confirm: boolean = false;

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
     * Closes the dialog with true to signal that the action should be run.
     */
    confirmAction(): void {
        this.dialogRef.close(true);
    }

    /**
     * Closes the dialog.
     */
    cancel(): void {
        this.dialogRef.close(false);
    }
}