import { HttpClient } from '@angular/common/http';
import { EnvironmentInjector, Injectable } from '@angular/core';
import { EntityService } from 'ngx-material-entity';

import { Sport } from '../models/sport.model';

@Injectable({ providedIn: 'root' })
export class SportService extends EntityService<Sport> {
    readonly baseUrl: string = 'http://localhost:3000/sports';

    override editBaseRoute: string = 'sports';

    constructor(http: HttpClient, injector: EnvironmentInjector) {
        super(http, injector);
    }
}