import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { NavMenuModule } from './nav-menu/nav-menu.module';

@NgModule({
    declarations: [NavbarComponent],
    imports: [
        CommonModule,
        MatToolbarModule,
        RouterModule,
        MatButtonModule,
        MatMenuModule,
        NavMenuModule
    ],
    exports: [NavbarComponent]
})
export class NavbarModule {}