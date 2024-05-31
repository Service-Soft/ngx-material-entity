
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DefaultNavRouteDataType, NavRoute, NavbarRow, NgxMatNavigationFooterComponent, NgxMatNavigationNavbarComponent } from 'ngx-material-navigation';

import { navbarRows } from './routes';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        RouterModule,
        NgxMatNavigationFooterComponent,
        NgxMatNavigationNavbarComponent
    ]
})
export class AppComponent {
    navbarRows: NavbarRow<NavRoute<DefaultNavRouteDataType>>[] = navbarRows;
}