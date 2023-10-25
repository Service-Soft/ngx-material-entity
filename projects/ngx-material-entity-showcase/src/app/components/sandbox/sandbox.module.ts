import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxMatEntityTableComponent } from 'ngx-material-entity';
import { SandboxRoutingModule } from './sandbox-routing.module';
import { SandboxComponent } from './sandbox.component';

@NgModule({
    imports: [
        CommonModule,
        NgxMatEntityTableComponent,
        SandboxRoutingModule
    ],
    declarations: [SandboxComponent]
})
export class SandboxModule { }