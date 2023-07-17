import { Route, Routes } from '@angular/router';
import { EditDataRoute, NGX_EDIT_DATA, NGX_EDIT_DATA_ENTITY, NGX_EDIT_DATA_ENTITY_SERVICE, PageEditData, defaultEditDataRoute } from 'ngx-material-entity';
import { NavElementTypes, NavUtilities, NavbarRow } from 'ngx-material-navigation';
import { TestEntity } from '../../../ngx-material-entity/src/mocks/test-entity.mock';
import { TestEntityService } from '../services/test-entity.service';

export const navbarRows: NavbarRow[] = [
    {
        elements: [
            {
                type: NavElementTypes.TITLE_WITH_INTERNAL_LINK,
                title: 'Showcase Project',
                icon: 'fa-brands fa-angular',
                link: {
                    route: 'home'
                },
                collapse: 'never'
            },
            {
                type: NavElementTypes.INTERNAL_LINK,
                name: 'Home',
                icon: 'fas fa-home',
                route: {
                    title: 'Home',
                    path: 'home',
                    loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule)
                },
                collapse: 'md'
            },
            {
                type: NavElementTypes.INTERNAL_LINK,
                name: 'Sandbox',
                icon: 'fas fa-umbrella-beach',
                route: {
                    title: 'Sandbox',
                    path: 'sandbox',
                    loadChildren: () => import('./components/sandbox/sandbox.module').then(m => m.SandboxModule)
                },
                collapse: 'md'
            },
            {
                type: NavElementTypes.INTERNAL_LINK,
                name: 'Table',
                icon: 'fas fa-table',
                route: {
                    title: 'Table',
                    path: 'table',
                    loadChildren: () => import('./components/showcase-table/showcase-table.module').then(m => m.ShowcaseTableModule)
                },
                position: 'center',
                collapse: 'md'
            },
            {
                type: NavElementTypes.MENU,
                name: 'Inputs',
                icon: 'fas fa-keyboard',
                elements: [
                    {
                        type: NavElementTypes.INTERNAL_LINK,
                        name: '@string',
                        route: 'inputs/string'
                    },
                    {
                        type: NavElementTypes.INTERNAL_LINK,
                        name: '@number',
                        route: 'inputs/number'
                    },
                    {
                        type: NavElementTypes.INTERNAL_LINK,
                        name: '@boolean',
                        route: 'inputs/boolean'
                    },
                    {
                        type: NavElementTypes.INTERNAL_LINK,
                        name: '@array',
                        route: 'inputs/array'
                    },
                    {
                        type: NavElementTypes.INTERNAL_LINK,
                        name: '@object',
                        route: 'inputs/object'
                    },
                    {
                        type: NavElementTypes.INTERNAL_LINK,
                        name: '@date',
                        route: 'inputs/date'
                    },
                    {
                        type: NavElementTypes.INTERNAL_LINK,
                        name: '@file',
                        route: 'inputs/file'
                    },
                    {
                        type: NavElementTypes.INTERNAL_LINK,
                        name: '@custom',
                        route: 'inputs/custom'
                    }
                ],
                position: 'center',
                collapse: 'md'
            },
            {
                type: NavElementTypes.MENU,
                name: 'Dialogs',
                icon: 'fas fa-circle-exclamation',
                elements: [],
                position: 'center',
                collapse: 'md'
            },
            {
                type: NavElementTypes.BUTTON,
                name: 'Reset Data',
                icon: 'fas fa-rotate-right',
                action: () => fetch('http://localhost:3000/reset/', { method: 'POST' }).then(() => location.reload()),
                position: 'right',
                collapse: 'sm'
            }
        ]
    }
];

const inputRoute: Route = {
    path: 'inputs/:type',
    loadChildren: () => import('./components/showcase-inputs/showcase-inputs.module').then(m => m.ShowcaseInputsModule)
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

export const routes: Routes = NavUtilities.getAngularRoutes(navbarRows, [], [inputRoute, editTestEntityRoute]);