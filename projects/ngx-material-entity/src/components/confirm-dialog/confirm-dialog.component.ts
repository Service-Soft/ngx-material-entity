import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogData } from './confirm-dialog-data';

@Component({
    selector: 'ngx-mat-entity-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class NgxMatEntityConfirmDialogComponent implements OnInit {
    /**
     * Used for the checkbox to confirm the action
     */
    confirm = false;

    constructor(
        private readonly dialogRef: MatDialogRef<NgxMatEntityConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        readonly data: ConfirmDialogData
    ) {}

    ngOnInit(): void {
        if (this.data.requireConfirmation && !this.data.confirmationText) {
            throw new Error(`
                Missing required Input "confirmationText".
                You can only omit this if you dont have "requireConfirmation" set`
            );
        }
        if (!this.data.requireConfirmation && this.data.confirmationText) {
            throw new Error(
                'The "confirmationText" will never be shown because "requireConfirmation" is not set to true'
            );
        }
        if (this.data.requireConfirmation !== true && this.data.requireConfirmation !== false) {
            this.data.requireConfirmation = false;
        }
        if (this.data.type === 'info-only' && this.data.cancelButtonLabel) {
            throw new Error('The "cancelButtonLabel" will never be shown because "type" is set to "info-only"');
        }
        this.dialogRef.disableClose = true;
    }

    confirmAction(): void {
        this.dialogRef.close(1);
    }

    cancel(): void {
        this.dialogRef.close();
    }
}