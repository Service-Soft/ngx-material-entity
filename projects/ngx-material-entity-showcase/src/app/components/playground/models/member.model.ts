import { string } from 'ngx-material-entity';

import { BaseEntity } from './base-entity.model';

export class Member extends BaseEntity {

    @string({
        displayName: 'Name',
        displayStyle: 'line'
    })
    name: string;

    @string({
        displayName: 'E-Mail',
        displayStyle: 'line',
        required: false
    })
    email: string | undefined;

    @string({
        displayName: 'Telefon',
        displayStyle: 'line',
        required: false
    })
    phone: string | undefined;

    // @custom<ChangeSet[], ChangeSetsInputMetadata, Member>({
    //     displayName: 'Change Sets',
    //     component: ChangeSetsInputComponent,
    //     customMetadata: {
    //         changeSetsApiBaseUrl: 'http://localhost:3000/members/change-sets'
    //     },
    //     omitForCreate: true,
    //     // omitForUpdate: true,
    //     isReadOnly: true,
    //     position: {
    //         tab: 99,
    //         tabName: 'Änderungen'
    //     },
    //     defaultWidths: [12, 12, 12]
    // })
    // changeSets: ChangeSet[];

    constructor(entity?: Member) {
        super(entity);
        this.email = entity?.email;
        this.name = entity?.name as string;
        // this.changeSets = entity?.changeSets as ChangeSet[];
    }
}