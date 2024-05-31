import { provideHttpClient } from '@angular/common/http';
import { enableProdMode } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { NGX_GLOBAL_DEFAULT_VALUES, NgxGlobalDefaultValues } from 'ngx-material-entity';

import { AppComponent } from './app/app.component';
import { routes } from './app/routes';
import { environment } from './environments/environment';

const DateFormats: MatDateFormats = {
    parse: {
        dateInput: 'DD.MM.YYYY'
    },
    display: {
        dateInput: 'DD.MM.YYYY',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY'
    }
};

const NgxEntityDefaults: Partial<NgxGlobalDefaultValues> = {
    // saveLabel: 'Default Save',
    // searchLabel: 'Default Search'
};

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(
    AppComponent,
    {
        providers: [
            provideRouter(routes),
            provideAnimations(),
            provideHttpClient(),
            {
                provide: DateAdapter,
                useClass: MomentDateAdapter,
                deps: [MAT_DATE_LOCALE]
            },
            {
                provide: MAT_DATE_FORMATS,
                useValue: DateFormats
            },
            {
                provide: NGX_GLOBAL_DEFAULT_VALUES,
                useValue: NgxEntityDefaults
            }
        ]
    }
// eslint-disable-next-line promise/prefer-await-to-callbacks, no-console
).catch(error => console.error(error));