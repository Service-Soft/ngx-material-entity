import { Component, Input } from '@angular/core';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';

import { TooltipDirective } from '../../directives/tooltip.directive';

/**
 * A component that displays an info-symbol and a tooltip when it is hovered/clicked.
 */
@Component({
    selector: 'ngx-mat-entity-tooltip',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.scss'],
    standalone: true,
    imports: [TooltipDirective, FaIconComponent]
})
export class TooltipComponent {

    // eslint-disable-next-line jsdoc/require-jsdoc
    faInfo: IconDefinition = faInfo;

    /**
     * What to display inside the tooltip.
     */
    @Input({ required: true })
    tooltipContent!: string;
}