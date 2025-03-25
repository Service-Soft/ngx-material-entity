import { inject } from '@angular/core';

import { MemberService } from './member.service';
import { Member } from '../models/member.model';

export async function getMembers(): Promise<Member[]> {
    const service: MemberService = inject(MemberService);
    return await service.read();
}