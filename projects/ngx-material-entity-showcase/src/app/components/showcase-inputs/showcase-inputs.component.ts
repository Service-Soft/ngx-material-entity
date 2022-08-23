/* eslint-disable jsdoc/require-jsdoc */
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DecoratorTypes, EntityUtilities } from 'ngx-material-entity';
import { TestEntity, TestEntityMockBuilder } from '../../../../../ngx-material-entity/src/mocks/test-entity.mock';

@Component({
    selector: 'app-showcase-inputs',
    templateUrl: './showcase-inputs.component.html',
    styleUrls: ['./showcase-inputs.component.scss']
})
export class ShowcaseInputsComponent {

    private readonly STRING_DECORATOR_TYPES = [
        DecoratorTypes.STRING_DROPDOWN,
        DecoratorTypes.STRING_TEXTBOX,
        DecoratorTypes.STRING_AUTOCOMPLETE,
        DecoratorTypes.STRING
    ];

    private readonly NUMBER_DECORATOR_TYPES = [
        DecoratorTypes.NUMBER,
        DecoratorTypes.NUMBER_DROPDOWN
    ];

    private readonly ARRAY_DECORATOR_TYPES = [
        DecoratorTypes.ARRAY,
        DecoratorTypes.ARRAY_STRING_AUTOCOMPLETE_CHIPS,
        DecoratorTypes.ARRAY_STRING_CHIPS,
        DecoratorTypes.ARRAY_DATE,
        DecoratorTypes.ARRAY_DATE_TIME,
        DecoratorTypes.ARRAY_DATE_RANGE
    ];

    private readonly BOOLEAN_DECORATOR_TYPES = [
        DecoratorTypes.BOOLEAN_CHECKBOX,
        DecoratorTypes.BOOLEAN_DROPDOWN,
        DecoratorTypes.BOOLEAN_TOGGLE
    ];

    private readonly OBJECT_DECORATOR_TYPES = [
        DecoratorTypes.OBJECT
    ];

    private readonly DATE_DECORATOR_TYPES = [
        DecoratorTypes.DATE,
        DecoratorTypes.DATE_TIME,
        DecoratorTypes.DATE_RANGE
    ];

    private readonly FILE_DECORATOR_TYPES = [
        DecoratorTypes.FILE_DEFAULT,
        DecoratorTypes.FILE_IMAGE
    ];

    testEntity = new TestEntityMockBuilder().testEntityWithoutData;
    keys!: (keyof TestEntity)[];

    inputValues: boolean = false;

    EntityUtilities = EntityUtilities;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router
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

    async toggleInputValues(): Promise<void> {
        if (this.inputValues) {
            this.testEntity = new TestEntityMockBuilder().testEntityWithoutData;
        }
        else {
            this.testEntity = new TestEntityMockBuilder().testEntity;
        }
        this.inputValues = !this.inputValues;
    }

    private setKeys(types: DecoratorTypes[]): void {
        this.keys = EntityUtilities
            .keysOf(this.testEntity)
            .filter(k => types.includes(EntityUtilities.getPropertyType(this.testEntity, k)));
    }
}