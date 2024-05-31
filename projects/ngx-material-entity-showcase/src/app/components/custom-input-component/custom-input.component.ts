import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DecoratorTypes, NgxMatEntityBaseInputComponent } from 'ngx-material-entity';

import { RandomMetadata, TestEntity } from '../../../../../ngx-material-entity/src/mocks/test-entity.mock';

@Component({
    selector: 'app-custom-input-component',
    templateUrl: './custom-input.component.html',
    styleUrls: ['./custom-input.component.scss'],
    standalone: true,
    imports: [MatFormFieldModule, FormsModule, MatButtonModule, MatInputModule]
})
export class TestRandomInputComponent
    extends NgxMatEntityBaseInputComponent<TestEntity, DecoratorTypes.CUSTOM, string, RandomMetadata> implements OnInit {

    randomInput(): void {
        this.propertyValue = this.metadata.customMetadata.random();
        this.emitChange();
    }
}