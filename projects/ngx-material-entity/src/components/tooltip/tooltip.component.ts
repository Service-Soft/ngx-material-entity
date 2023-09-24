import { Component, Input } from '@angular/core';
import { TooltipDirective } from '../../directives/tooltip.directive';

/**
 * A component that displays an info-symbol and a tooltip when it is hovered/clicked.
 */
@Component({
    selector: 'ngx-mat-entity-tooltip',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.scss'],
    standalone: true,
    imports: [
        TooltipDirective
    ]
})
export class TooltipComponent {
    @Input()
    tooltipContent!: string;
}