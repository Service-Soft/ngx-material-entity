import { Component } from '@angular/core';
import { NgxMatEntityTableComponent, TableData } from 'ngx-material-entity';

import { Sport } from './models/sport.model';
import { SportService } from './services/sport.service';

@Component({
    standalone: true,
    selector: 'app-playground',
    templateUrl: './playground.component.html',
    imports: [NgxMatEntityTableComponent]
})
export class PlaygroundComponent {
    tableConfig: TableData<Sport> = {
        baseData: {
            title: 'Sportarten',
            displayColumns: [
                {
                    displayName: 'Name',
                    value: s => s.name
                },
                {
                    displayName: 'Teams',
                    value: s => s.teams?.length
                }
            ],
            EntityClass: Sport,
            EntityServiceClass: SportService,
            allowCreate: false,
            defaultEdit: 'page'
        }
    };
}