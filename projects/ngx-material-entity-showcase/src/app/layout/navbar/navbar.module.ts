import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavElementModule } from './nav-element/nav-element.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@NgModule({
    declarations: [NavbarComponent],
    imports: [
        CommonModule,
        MatToolbarModule,
        NavElementModule,
        MatSidenavModule,
        MatListModule
    ],
    exports: [NavbarComponent]
})
export class NavbarModule {}