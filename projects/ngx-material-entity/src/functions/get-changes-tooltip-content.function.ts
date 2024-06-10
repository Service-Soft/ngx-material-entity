import { InjectionToken, inject } from '@angular/core';

import { BaseEntityType } from '../classes/entity.model';
import { Difference } from '../utilities/entity.utilities';

/**
 * Provider for the changes tooltip title.
 */
export const NgxChangesTooltipTitle: InjectionToken<string> = new InjectionToken(
    'Provider for the changes tooltip title.',
    {
        providedIn: 'root',
        factory: () => 'Changed Values:'
    }
);

/**
 * The default function that gets the changes tooltip content.
 * @param changes - All changes for which the tooltip content should be generated.
 * @returns A html string, containing a list of the name of each changed property.
 */
export function getChangesTooltipContent<EntityType extends BaseEntityType<EntityType>>(changes: Difference<EntityType>[]): string {
    const title: string = inject(NgxChangesTooltipTitle);
    let res: string = `${title}\n<br>\n<ul style="margin-bottom: 0px; padding-left: 16px;">`;
    for (const change of changes) {
        res = res.concat(`\n\t<li>${String(change.key)}</li>`);
    }
    res = res.concat('\n</ul>');
    return res;
}