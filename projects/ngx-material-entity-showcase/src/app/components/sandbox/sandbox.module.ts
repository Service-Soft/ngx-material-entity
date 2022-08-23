import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SandboxComponent } from './sandbox.component';
import { SandboxRoutingModule } from './sandbox-routing.module';
import { NgxMatEntityTableModule } from 'ngx-material-entity';

@NgModule({
    imports: [
        CommonModule,
        SandboxRoutingModule,
        NgxMatEntityTableModule
    ],
    declarations: [SandboxComponent]
})
export class SandboxModule { }