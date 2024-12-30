import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faDice } from '@fortawesome/free-solid-svg-icons';
import { DecoratorTypes, NgxMatEntityBaseInputComponent } from 'ngx-material-entity';

import { RandomMetadata, TestEntity } from '../../../../../ngx-material-entity/src/mocks/test-entity.mock';

@Component({
    selector: 'app-custom-input-component',
    templateUrl: './custom-input.component.html',
    standalone: true,
    imports: [MatFormFieldModule, FormsModule, MatButtonModule, MatInputModule, FaIconComponent]
})
export class TestRandomInputComponent
    extends NgxMatEntityBaseInputComponent<TestEntity, DecoratorTypes.CUSTOM, string, RandomMetadata> implements OnInit {

    faDice: IconDefinition = faDice;

    randomInput(): void {
        this.propertyValue = this.metadata.customMetadata.random();
        this.emitChange();
    }
}