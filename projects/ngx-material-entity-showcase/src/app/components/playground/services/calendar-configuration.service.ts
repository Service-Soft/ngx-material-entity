import { HttpClient } from '@angular/common/http';
import { EnvironmentInjector, Injectable } from '@angular/core';
import { EntityService } from 'ngx-material-entity';

import { CalendarConfiguration } from '../models/calendar-configuration.model';

@Injectable({ providedIn: 'root' })
export class CalendarConfigurationService extends EntityService<CalendarConfiguration> {
    readonly baseUrl: string = 'http://localhost:3000/calendar-configurations';

    constructor(http: HttpClient, injector: EnvironmentInjector) {
        super(http, injector);
    }
}