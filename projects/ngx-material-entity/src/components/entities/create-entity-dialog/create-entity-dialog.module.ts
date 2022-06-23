import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateEntityDialogComponent } from './create-entity-dialog.component';
import { PropertyInputModule } from '../../property-input/property-input.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [CreateEntityDialogComponent],
    imports: [CommonModule, PropertyInputModule, MatDialogModule, FormsModule, MatButtonModule],
    exports: [CreateEntityDialogComponent]
})
export class CreateEntityDialogModule {}