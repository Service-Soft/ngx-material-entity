import * as uuid from 'uuid';

/**
 * Encapsulates functionality of the uuid package.
 */
export abstract class UUIDUtilities {
    /**
     * Creates a new v4 uuid.
     *
     * @returns The created uuid.
     */
    static create(): string {
        return uuid.v4();
    }
}