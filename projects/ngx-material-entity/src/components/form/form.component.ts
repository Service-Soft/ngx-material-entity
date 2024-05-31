import { NgFor, NgIf } from '@angular/common';
import { Component, EnvironmentInjector, EventEmitter, Input, OnInit, Output, runInInjectionContext } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';

import { BaseEntityType } from '../../classes/entity.model';
import { PropertyDecoratorConfigInternal } from '../../decorators/base/property-decorator-internal.data';
import { EntityTab, EntityUtilities } from '../../utilities/entity.utilities';
import { NgxMatEntityInputComponent } from '../input/input.component';

/**
 * A form component based on the ngx-material-entity framework.
 */
@Component({
    selector: 'ngx-mat-entity-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        MatTabsModule,
        NgxMatEntityInputComponent
    ]
})
export class NgxMatEntityFormComponent<EntityType extends BaseEntityType<EntityType>> implements OnInit {

    // eslint-disable-next-line jsdoc/require-jsdoc
    EntityUtilities: typeof EntityUtilities = EntityUtilities;

    /**
     * The entity that should be represented by the form.
     */
    @Input({ required: true })
    entity!: EntityType;

    /**
     * The tabs to display.
     */
    entityTabs!: EntityTab<EntityType>[];

    /**
     * Whether or not the entity is readonly.
     * @default false
     */
    @Input()
    isEntityReadOnly: boolean = false;

    /**
     * Whether to hide a value if it is omitted for creation.
     * Is used internally for the object property.
     * @default false
     */
    @Input()
    hideOmitForCreate?: boolean;

    /**
     * Whether to hide a value if it is omitted for editing.
     * Is used internally for the object property.
     * @default false
     */
    @Input()
    hideOmitForEdit?: boolean;

    /**
     * Additional keys that should be omitted.
     */
    @Input()
    additionalOmitKeys?: (keyof EntityType)[];

    /**
     * Fires whenever an input of the form changes.
     */
    @Output()
    readonly formChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Fires when the selected tab has been changed.
     */
    @Output()
    readonly selectedTabChange: EventEmitter<MatTabChangeEvent> = new EventEmitter<MatTabChangeEvent>();

    constructor(private readonly injector: EnvironmentInjector) { }

    ngOnInit(): void {
        this.entityTabs = EntityUtilities.getEntityTabs(
            this.entity,
            this.injector,
            this.hideOmitForCreate,
            this.hideOmitForEdit,
            this.additionalOmitKeys
        );
    }

    /**
     * Checks if the input with the given key is readonly.
     * @param key - The key for the input to check.
     * @returns Whether or not the input for the key is read only.
     */
    isReadOnly(key: keyof EntityType): boolean {
        return runInInjectionContext(this.injector, () => {
            const metadata: PropertyDecoratorConfigInternal<unknown> | undefined = EntityUtilities.getPropertyMetadata(this.entity, key);
            if (!metadata) {
                throw new Error(`No metadata was found for the key "${String(key)}"`);
            }
            return this.isEntityReadOnly || metadata.isReadOnly(this.entity);
        });
    }

    /**
     * What happens when an input changes its value.
     * This refreshes the entity tabs to check if there are now different inputs to display and emits the form change.
     */
    inputChange(): void {
        this.entityTabs = EntityUtilities.getEntityTabs(
            this.entity,
            this.injector,
            this.hideOmitForCreate,
            this.hideOmitForEdit,
            this.additionalOmitKeys
        );
        this.formChange.emit();
    }
}