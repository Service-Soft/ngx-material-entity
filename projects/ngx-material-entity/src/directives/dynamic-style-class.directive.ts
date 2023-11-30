import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { BaseEntityType } from '../classes/entity.model';
import { DynamicStyleClasses } from '../components/table/table-data';

/**
 * Dynamically applies css classes based on a provided function.
 */
@Directive({ selector: '[dynamicStyleClasses]', standalone: true })
export class DynamicStyleClassDirective<EntityType extends BaseEntityType<EntityType>> implements OnChanges {

    private styleClassesApplied: string[] = [];

    /**
     * The function that gets the css classes to dynamically apply.
     */
    @Input({ required: true })
    dynamicStyleClasses!: DynamicStyleClasses<EntityType>;

    /**
     * The input for the dynamic style classes function.
     */
    @Input({ required: true })
    entity!: EntityType;

    constructor(private readonly element: ElementRef, private readonly renderer: Renderer2) {}

    ngOnChanges(): void {
        this.applyDynamicClasses();
    }

    private applyDynamicClasses(): void {
        const classes: string[] | void = this.dynamicStyleClasses(this.entity);

        for (const styleClass of this.styleClassesApplied) {
            this.renderer.removeClass(this.element.nativeElement, styleClass);
        }
        this.styleClassesApplied = [];
        if (classes?.length) {
            for (const styleClass of classes) {
                this.renderer.addClass(this.element.nativeElement, styleClass);
                this.styleClassesApplied.push(styleClass);
            }
        }
    }
}