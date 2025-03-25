import { HttpClient } from '@angular/common/http';
import { EnvironmentInjector, Injectable } from '@angular/core';
import { EntityService } from 'ngx-material-entity';

import { Team } from '../models/team.model';

@Injectable({ providedIn: 'root' })
export class TeamService extends EntityService<Team> {
    readonly baseUrl: string = 'http://localhost:3000/teams';

    constructor(http: HttpClient, injector: EnvironmentInjector) {
        super(http, injector);
    }
}