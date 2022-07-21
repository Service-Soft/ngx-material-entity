import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseTableComponent } from './showcase-table.component';
import { NgxMatEntityTableModule } from 'ngx-material-entity';
import { ShowcaseTableRoutingModule } from './showcase-table-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    imports: [
        CommonModule,
        NgxMatEntityTableModule,
        MatFormFieldModule,
        ShowcaseTableRoutingModule,
        MatSlideToggleModule,
        FormsModule,
        MatSelectModule,
        MatButtonModule
    ],
    declarations: [ShowcaseTableComponent]
})
export class ShowcaseTableModule { }