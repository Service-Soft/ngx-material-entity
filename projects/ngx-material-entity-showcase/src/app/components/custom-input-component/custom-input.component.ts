/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { DecoratorTypes, NgxMatEntityBaseInputComponent } from 'ngx-material-entity';
import { RandomMetadata, TestEntity } from '../../../../../ngx-material-entity/src/mocks/test-entity.mock';

@Component({
    selector: 'app-custom-input-component',
    templateUrl: './custom-input.component.html',
    styleUrls: ['./custom-input.component.scss']
})
export class TestRandomInputComponent
    extends NgxMatEntityBaseInputComponent<TestEntity, DecoratorTypes.CUSTOM, RandomMetadata> implements OnInit {

    randomInput(): void {
        // this conversion is not needed under real life conditions
        (this.entity[this.key] as string) = this.metadata.customMetadata.random();
        this.emitChange();
    }
}