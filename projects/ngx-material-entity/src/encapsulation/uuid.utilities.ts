import * as uuid from 'uuid';

/**
 *
 */
export abstract class UUIDUtilities {
    /**
     *
     */
    static create(): string {
        return uuid.v4();
    }
}