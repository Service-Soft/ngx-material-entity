import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseTableComponent } from './showcase-table.component';
import { NgxMatEntityTableModule } from 'ngx-material-entity';
import { ShowcaseRoutingModule } from './showcase-table-routing.module';

@NgModule({
    imports: [
        CommonModule,
        NgxMatEntityTableModule,
        ShowcaseRoutingModule
    ],
    declarations: [ShowcaseTableComponent]
})
export class ShowcaseTableModule { }