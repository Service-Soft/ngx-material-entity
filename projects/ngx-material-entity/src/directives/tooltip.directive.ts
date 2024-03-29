import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';

/**
 * The type of a global listener. Is a function that simply unsubscribes the listener.
 */
type Listener = () => void;

/**
 * A directive that displays a tooltip on hover.
 */
@Directive({
    selector: '[tooltip]',
    standalone: true
})
export class TooltipDirective implements OnDestroy {

    /**
     * The content to display inside the tooltip.
     */
    @Input()
    tooltip!: string;

    private tooltipElement?: HTMLElement;

    private closeListeners: Listener[] = [];

    private openedByClick: boolean = false;

    constructor(
        private readonly el: ElementRef,
        private readonly renderer: Renderer2
    ) {}

    /**
     * Toggles the tooltip.
     * @param event - The click event, is used to stop the propagation that would trigger the global click listener.
     */
    @HostListener('click', ['$event'])
    onClick(event: Event): void {
        event.stopPropagation();
        if (!this.tooltipElement) {
            this.showTooltip();
            this.registerCloseListeners();
            this.openedByClick = true;
            return;
        }
        if (!this.openedByClick) {
            this.openedByClick = true;
            return;
        }
        this.hideTooltip();
        this.removeCloseListeners();
    }

    /**
     * Shows the tooltip.
     */
    @HostListener('mouseenter')
    onMouseEnter(): void {
        if (!this.tooltipElement) {
            this.showTooltip();
            this.registerCloseListeners();
            return;
        }
        if (this.openedByClick) {
            return;
        }
    }

    /**
     * Hides the tooltip.
     */
    @HostListener('mouseleave')
    onMouseLeave(): void {
        if (this.openedByClick) {
            return;
        }
        this.hideTooltip();
        this.removeCloseListeners();
    }

    /**
     * Hides the tooltip.
     */
    @HostListener('window:resize')
    onResize(): void {
        this.hideTooltip();
        this.removeCloseListeners();
    }

    private showTooltip(): void {
        if (!this.tooltipElement) {
            this.tooltipElement = this.renderer.createElement('div') as HTMLElement;
            this.tooltipElement.innerHTML = this.tooltip;

            this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');
            this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
            this.renderer.setStyle(this.tooltipElement, 'padding', '4px 8px 4px 8px');
            this.renderer.setStyle(this.tooltipElement, 'border-radius', '5px');
            this.renderer.setStyle(this.tooltipElement, 'background-color', '#616161');
            this.renderer.setStyle(this.tooltipElement, 'color', 'white');
            this.renderer.setStyle(this.tooltipElement, 'max-height', '30vh');
            this.renderer.setStyle(this.tooltipElement, 'overflow', 'scroll');
            this.renderer.appendChild(this.el.nativeElement, this.tooltipElement);

            const marginBottom: number = this.tooltipElement.clientHeight + (this.el.nativeElement as HTMLElement).clientHeight + 15;
            this.renderer.setStyle(this.tooltipElement, 'margin-bottom', `${marginBottom}px`);
        }
    }

    private registerCloseListeners(): void {
        setTimeout(() => {
            this.closeListeners.push(
                this.getCloseListener('click'),
                this.getCloseListener('touchmove'),
                this.getCloseListener('resize')
            );
        }, 100);
    }

    private getCloseListener(event: string): Listener {
        return this.renderer.listen('document', event, () => {
            this.hideTooltip();
            this.removeCloseListeners();
        });
    }

    private hideTooltip(): void {
        if (this.tooltipElement) {
            this.renderer.removeChild(this.el.nativeElement, this.tooltipElement);
            this.tooltipElement = undefined;
        }
    }

    private removeCloseListeners(): void {
        for (const listener of this.closeListeners) {
            listener();
        }
        this.closeListeners = [];
        this.openedByClick = false;
    }

    ngOnDestroy(): void {
        this.removeCloseListeners();
    }
}