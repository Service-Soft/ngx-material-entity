import { string } from '../decorators/string.decorator';

/**
 * The base Entity class.
 */
export abstract class Entity {

    @string({
        omitForCreate: true,
        omitForUpdate: true,
        display: false,
        displayStyle: 'line',
        displayName: 'ID',
        required: true
    })
    id!: string;
}