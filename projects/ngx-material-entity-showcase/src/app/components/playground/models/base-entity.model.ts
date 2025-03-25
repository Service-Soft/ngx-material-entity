import { string } from 'ngx-material-entity';

export class BaseEntity {

    @string({
        displayName: 'ID',
        displayStyle: 'line',
        display: false,
        omitForCreate: true,
        omitForUpdate: true
    })
    readonly id: string;

    constructor(entity?: BaseEntity) {
        this.id = entity?.id as string;
    }
}