import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavElementComponent } from './nav-element.component';
import { NavMenuModule } from '../nav-menu/nav-menu.module';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
    imports: [
        CommonModule,
        NavMenuModule,
        RouterModule,
        MatMenuModule,
        MatButtonModule,
        MatSidenavModule
    ],
    declarations: [NavElementComponent],
    exports: [NavElementComponent]
})
export class NavElementModule { }