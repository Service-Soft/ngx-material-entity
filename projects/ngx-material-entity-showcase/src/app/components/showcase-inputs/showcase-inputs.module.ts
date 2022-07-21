import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseInputsComponent } from './showcase-inputs.component';
import { ShowcaseInputsRoutingModule } from './showcase-inputs-routing.module';
import { NgxMatEntityInputModule } from 'ngx-material-entity';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        CommonModule,
        ShowcaseInputsRoutingModule,
        FormsModule,
        MatButtonModule,
        NgxMatEntityInputModule
    ],
    declarations: [ShowcaseInputsComponent]
})
export class ShowcaseInputsModule { }