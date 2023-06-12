import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMatEntityTableComponent } from 'ngx-material-entity';
import { ShowcaseTableRoutingModule } from './showcase-table-routing.module';
import { ShowcaseTableComponent } from './showcase-table.component';

@NgModule({
    imports: [
        CommonModule,
        NgxMatEntityTableComponent,
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