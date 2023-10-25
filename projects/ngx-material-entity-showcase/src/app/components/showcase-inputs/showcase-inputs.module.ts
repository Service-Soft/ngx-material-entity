import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgxMatEntityInputModule } from 'ngx-material-entity';
import { ShowcaseInputsRoutingModule } from './showcase-inputs-routing.module';
import { ShowcaseInputsComponent } from './showcase-inputs.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        NgxMatEntityInputModule,
        ShowcaseInputsRoutingModule
    ],
    declarations: [ShowcaseInputsComponent]
})
export class ShowcaseInputsModule { }