import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseTableComponent } from './showcase-table.component';
import { NgxMatEntityInputModule, NgxMatEntityTableModule } from 'ngx-material-entity';
import { ShowcaseTableRoutingModule } from './showcase-table-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        NgxMatEntityTableModule,
        NgxMatEntityInputModule,
        ShowcaseTableRoutingModule,
        MatSlideToggleModule,
        FormsModule
    ],
    declarations: [ShowcaseTableComponent]
})
export class ShowcaseTableModule { }