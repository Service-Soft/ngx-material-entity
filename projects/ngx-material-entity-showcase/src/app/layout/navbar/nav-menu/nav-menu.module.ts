import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from './nav-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        CommonModule,
        MatMenuModule,
        RouterModule,
        MatButtonModule
    ],
    declarations: [NavMenuComponent],
    exports: [NavMenuComponent]
})
export class NavMenuModule { }