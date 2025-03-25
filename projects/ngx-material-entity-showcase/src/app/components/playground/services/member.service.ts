import { HttpClient } from '@angular/common/http';
import { EnvironmentInjector, Injectable } from '@angular/core';
import { EntityService } from 'ngx-material-entity';

import { Member } from '../models/member.model';

@Injectable({ providedIn: 'root' })
export class MemberService extends EntityService<Member> {
    readonly baseUrl: string = 'http://localhost:3000/members';

    constructor(http: HttpClient, injector: EnvironmentInjector) {
        super(http, injector);
    }
}