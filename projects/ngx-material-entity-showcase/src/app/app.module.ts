import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NGX_GLOBAL_DEFAULT_VALUES, NgxGlobalDefaultValues } from 'ngx-material-entity';
import { NgxMatNavigationFooterModule, NgxMatNavigationNavbarModule } from 'ngx-material-navigation';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestRandomInputComponent } from './components/custom-input-component/custom-input.component';

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

@NgModule({
    declarations: [
        AppComponent,
        TestRandomInputComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        MatSliderModule,
        NgxMatNavigationFooterModule,
        NgxMatNavigationNavbarModule
    ],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: DateFormats },
        {
            provide: NGX_GLOBAL_DEFAULT_VALUES,
            useValue: NgxEntityDefaults
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }