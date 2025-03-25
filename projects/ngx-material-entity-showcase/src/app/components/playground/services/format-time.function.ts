import { Time } from '../models/time.model';

/**
 * Formats the given time.
 * @param time - The time to format.
 * @returns The stringified version of the time in the format HH:mm.
 */
export function formatTime(time: Time): string {
    const hours: string = time.hours.toLocaleString('de', { minimumIntegerDigits: 2 });
    const minutes: string = time.minutes.toLocaleString('de', { minimumIntegerDigits: 2 });
    return `${hours}:${minutes}`;
}