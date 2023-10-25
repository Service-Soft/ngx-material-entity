/* eslint-disable jsdoc/require-jsdoc */
import { Component, OnInit } from '@angular/core';
import { DecoratorTypes, NgxMatEntityBaseInputComponent } from 'ngx-material-entity';
import { RandomMetadata, TestEntity } from '../../../../../ngx-material-entity/src/mocks/test-entity.mock';

// eslint-disable-next-line angular/prefer-standalone-component
@Component({
    selector: 'app-custom-input-component',
    templateUrl: './custom-input.component.html',
    styleUrls: ['./custom-input.component.scss']
})
export class TestRandomInputComponent
    extends NgxMatEntityBaseInputComponent<TestEntity, DecoratorTypes.CUSTOM, string, RandomMetadata> implements OnInit {

    randomInput(): void {
        this.propertyValue = this.metadata.customMetadata.random();
        this.emitChange();
    }
}