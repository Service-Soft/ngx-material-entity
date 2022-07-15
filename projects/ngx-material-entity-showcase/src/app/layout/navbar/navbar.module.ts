import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [NavbarComponent],
    imports: [
        CommonModule,
        MatToolbarModule,
        RouterModule,
        MatButtonModule
    ],
    exports: [NavbarComponent]
})
export class NavbarModule {}