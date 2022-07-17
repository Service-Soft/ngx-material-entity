import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseInputsComponent } from './showcase-inputs.component';
import { ShowcaseInputsRoutingModule } from './showcase-inputs-routing.module';
import { NgxMatEntityInputModule } from 'ngx-material-entity';

@NgModule({
    imports: [
        CommonModule,
        ShowcaseInputsRoutingModule,
        NgxMatEntityInputModule
    ],
    declarations: [ShowcaseInputsComponent]
})
export class ShowcaseInputsModule { }