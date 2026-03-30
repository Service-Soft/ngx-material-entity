import { Route, Routes } from '@angular/router';
import { faAngular } from '@fortawesome/free-brands-svg-icons';
import { faCircleExclamation, faHome, faKeyboard, faRotateRight, faTable, faUmbrellaBeach } from '@fortawesome/free-solid-svg-icons';
import { CreateDataRoute, EditDataRoute, NGX_CREATE_DATA, NGX_CREATE_DATA_ENTITY, NGX_CREATE_DATA_ENTITY_SERVICE, NGX_EDIT_DATA, NGX_EDIT_DATA_ENTITY, NGX_EDIT_DATA_ENTITY_SERVICE, PageEditData, UnsavedChangesGuard, defaultCreateDataRoute, defaultEditDataRoute } from 'ngx-material-entity';
import { NavElementTypes, NavUtilities, NavbarRow } from 'ngx-material-navigation';

import { TestEntity } from '../../../ngx-material-entity/src/mocks/test-entity.mock';
import { TestEntityService } from '../services/test-entity.service';
import { Sport } from './components/playground/models/sport.model';
import { SportService } from './components/playground/services/sport.service';

export const navbarRows: NavbarRow[] = [
    {
        elements: [
            {
                id: 'Showcase Project',
                type: NavElementTypes.TITLE_WITH_INTERNAL_LINK,
                title: 'Showcase Project',
                icon: faAngular,
                link: {
                    route: 'home'
                },
                collapse: 'never'
            },
            {
                id: 'Home',
                type: NavElementTypes.INTERNAL_LINK,
                name: 'Home',
                icon: faHome,
                route: {
                    title: 'Home',
                    path: 'home',
                    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
                },
                collapse: 'md'
            },
            {
                id: 'Sandbox',
                type: NavElementTypes.INTERNAL_LINK,
                name: 'Sandbox',
                icon: faUmbrellaBeach,
                route: {
                    title: 'Sandbox',
                    path: 'sandbox',
                    loadComponent: () => import('./components/sandbox/sandbox.component').then(m => m.SandboxComponent),
                    canDeactivate: [UnsavedChangesGuard]
                },
                collapse: 'md'
            },
            {
                id: 'Playground',
                type: NavElementTypes.INTERNAL_LINK,
                name: 'Playground',
                route: {
                    path: 'sports',
                    title: 'Sportarten | Admin',
                    loadComponent: () => import('./components/playground/playground.component').then(m => m.PlaygroundComponent)
                },
                collapse: 'md'
            },
            {
                id: 'Table',
                type: NavElementTypes.INTERNAL_LINK,
                name: 'Table',
                icon: faTable,
                route: {
                    title: 'Table',
                    path: 'table',
                    loadComponent: () => import('./components/showcase-table/showcase-table.component').then(m => m.ShowcaseTableComponent)
                },
                position: 'center',
                collapse: 'md'
            },
            {
                id: 'Inputs',
                type: NavElementTypes.MENU,
                name: 'Inputs',
                iconState: faKeyboard,
                elements: [
                    {
                        id: '@string',
                        type: NavElementTypes.INTERNAL_LINK,
                        name: '@string',
                        route: 'inputs/string'
                    },
                    {
                        type: NavElementTypes.INTERNAL_LINK,
                        name: '@number',
                        id: '@number',
                        route: 'inputs/number'
                    },
                    {
                        id: '@boolean',
                        type: NavElementTypes.INTERNAL_LINK,
                        name: '@boolean',
                        route: 'inputs/boolean'
                    },
                    {
                        id: '@array',
                        type: NavElementTypes.INTERNAL_LINK,
                        name: '@array',
                        route: 'inputs/array'
                    },
                    {
                        id: '@object',
                        type: NavElementTypes.INTERNAL_LINK,
                        name: '@object',
                        route: 'inputs/object'
                    },
                    {
                        id: '@date',
                        type: NavElementTypes.INTERNAL_LINK,
                        name: '@date',
                        route: 'inputs/date'
                    },
                    {
                        id: '@file',
                        type: NavElementTypes.INTERNAL_LINK,
                        name: '@file',
                        route: 'inputs/file'
                    },
                    {
                        id: '@custom',
                        type: NavElementTypes.INTERNAL_LINK,
                        name: '@custom',
                        route: 'inputs/custom'
                    }
                ],
                position: 'center',
                collapse: 'md'
            },
            {
                id: 'Dialogs',
                type: NavElementTypes.MENU,
                name: 'Dialogs',
                iconState: faCircleExclamation,
                elements: [],
                position: 'center',
                collapse: 'md'
            },
            {
                id: 'Reset Data',
                type: NavElementTypes.BUTTON,
                name: 'Reset Data',
                icon: faRotateRight,
                action: () => fetch('http://localhost:3000/reset/', { method: 'POST' }).then(() => location.reload()),
                position: 'right',
                collapse: 'sm'
            }
        ]
    }
];

const inputRoute: Route = {
    path: 'inputs/:type',
    loadComponent: () => import('./components/showcase-inputs/showcase-inputs.component').then(m => m.ShowcaseInputsComponent)
};

const editTestEntityData: PageEditData<TestEntity> = {
    editData: {
        title: (entity: TestEntity) => `Test Entity #${entity.id}`,
        actions: [
            {
                displayName: 'Log id',
                // eslint-disable-next-line no-console
                action: (e: TestEntity) => console.log(e.id)
            }
        ]
    }
};

const editTestEntityRoute: EditDataRoute = {
    ...defaultEditDataRoute,
    path: 'test-entities/:id',
    providers: [
        {
            provide: NGX_EDIT_DATA_ENTITY_SERVICE,
            useExisting: TestEntityService
        },
        {
            provide: NGX_EDIT_DATA_ENTITY,
            useValue: TestEntity
        },
        {
            provide: NGX_EDIT_DATA,
            useValue: editTestEntityData
        }
    ]
};

const createTestEntityRoute: CreateDataRoute = {
    ...defaultCreateDataRoute,
    providers: [
        {
            provide: NGX_CREATE_DATA_ENTITY_SERVICE,
            useExisting: TestEntityService
        },
        {
            provide: NGX_CREATE_DATA_ENTITY,
            useValue: TestEntity
        },
        {
            provide: NGX_CREATE_DATA,
            useValue: editTestEntityData
        }
    ]
};

const editSportData: PageEditData<Sport> = {
    editData: {
        title: (entity: Sport) => entity.name
    },
    allowDelete: () => false
};

const editSportRoute: EditDataRoute = {
    ...defaultEditDataRoute,
    path: 'sports/:id',
    providers: [
        {
            provide: NGX_EDIT_DATA_ENTITY_SERVICE,
            useExisting: SportService
        },
        {
            provide: NGX_EDIT_DATA_ENTITY,
            useValue: Sport
        },
        {
            provide: NGX_EDIT_DATA,
            useValue: editSportData
        }
    ]
};

export const routes: Routes = NavUtilities.getAngularRoutes(navbarRows, [], [inputRoute, editTestEntityRoute, createTestEntityRoute, editSportRoute]);