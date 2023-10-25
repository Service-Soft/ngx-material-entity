/* eslint-disable jsdoc/require-jsdoc */
import { Component, EnvironmentInjector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DecoratorTypes, EntityUtilities } from 'ngx-material-entity';
import { TestEntity, TestEntityMockBuilder } from '../../../../../ngx-material-entity/src/mocks/test-entity.mock';

// eslint-disable-next-line angular/prefer-standalone-component
@Component({
    selector: 'app-showcase-inputs',
    templateUrl: './showcase-inputs.component.html',
    styleUrls: ['./showcase-inputs.component.scss']
})
export class ShowcaseInputsComponent {

    private readonly STRING_DECORATOR_TYPES: DecoratorTypes[] = [
        DecoratorTypes.STRING_DROPDOWN,
        DecoratorTypes.STRING_TEXTBOX,
        DecoratorTypes.STRING_AUTOCOMPLETE,
        DecoratorTypes.STRING_PASSWORD,
        DecoratorTypes.STRING
    ];

    private readonly NUMBER_DECORATOR_TYPES: DecoratorTypes[] = [
        DecoratorTypes.NUMBER,
        DecoratorTypes.NUMBER_DROPDOWN,
        DecoratorTypes.NUMBER_SLIDER
    ];

    private readonly ARRAY_DECORATOR_TYPES: DecoratorTypes[] = [
        DecoratorTypes.ARRAY,
        DecoratorTypes.ARRAY_STRING_AUTOCOMPLETE_CHIPS,
        DecoratorTypes.ARRAY_STRING_CHIPS,
        DecoratorTypes.ARRAY_DATE,
        DecoratorTypes.ARRAY_DATE_TIME,
        DecoratorTypes.ARRAY_DATE_RANGE
    ];

    private readonly BOOLEAN_DECORATOR_TYPES: DecoratorTypes[] = [
        DecoratorTypes.BOOLEAN_CHECKBOX,
        DecoratorTypes.BOOLEAN_DROPDOWN,
        DecoratorTypes.BOOLEAN_TOGGLE
    ];

    private readonly OBJECT_DECORATOR_TYPES: DecoratorTypes[] = [
        DecoratorTypes.OBJECT
    ];

    private readonly DATE_DECORATOR_TYPES: DecoratorTypes[] = [
        DecoratorTypes.DATE,
        DecoratorTypes.DATE_TIME,
        DecoratorTypes.DATE_RANGE
    ];

    private readonly FILE_DECORATOR_TYPES: DecoratorTypes[] = [
        DecoratorTypes.FILE_DEFAULT,
        DecoratorTypes.FILE_IMAGE
    ];

    testEntity: TestEntity = new TestEntityMockBuilder().testEntityWithoutData;
    keys!: (keyof TestEntity)[];

    inputValues: boolean = false;
    isReadOnly: boolean = false;
    loaded: boolean = true;

    EntityUtilities: typeof EntityUtilities = EntityUtilities;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly injector: EnvironmentInjector
    ) {
        this.route.params.subscribe(params => {
            if ((params as unknown) != null) {
                const type: string | undefined = params['type'] as string | undefined;
                if (!type) {
                    void this.router.navigate(['/']);
                }
                switch (type) {
                    case 'string':
                        this.setKeys(this.STRING_DECORATOR_TYPES);
                        break;
                    case 'number':
                        this.setKeys(this.NUMBER_DECORATOR_TYPES);
                        break;
                    case 'array':
                        this.setKeys(this.ARRAY_DECORATOR_TYPES);
                        break;
                    case 'boolean':
                        this.setKeys(this.BOOLEAN_DECORATOR_TYPES);
                        break;
                    case 'object':
                        this.setKeys(this.OBJECT_DECORATOR_TYPES);
                        break;
                    case 'date':
                        this.setKeys(this.DATE_DECORATOR_TYPES);
                        break;
                    case 'file':
                        this.setKeys(this.FILE_DECORATOR_TYPES);
                        break;
                    case 'custom':
                        this.setKeys([DecoratorTypes.CUSTOM]);
                        break;
                    default:
                        throw new Error(`The specified type ${type} is unknown`);
                }
            }
            else {
                void this.router.navigate(['/']);
            }
        });
    }

    toggleInputValues(): void {
        this.loaded = false;

        this.testEntity = this.inputValues ? new TestEntityMockBuilder().testEntityWithoutData : new TestEntityMockBuilder().testEntity;
        this.inputValues = !this.inputValues;

        setTimeout(() => this.loaded = true, 1);
    }

    toggleReadOnly(): void {
        this.loaded = false;
        this.isReadOnly = !this.isReadOnly;
        setTimeout(() => this.loaded = true, 1);
    }

    private setKeys(types: DecoratorTypes[]): void {
        this.keys = EntityUtilities
            .keysOf(this.testEntity, this.injector)
            .filter(k => types.includes(EntityUtilities.getPropertyType(this.testEntity, k)));
    }
}