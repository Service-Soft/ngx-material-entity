import { configs } from 'eslint-config-service-soft';

// eslint-disable-next-line jsdoc/require-description
/** @type {import('eslint').Linter.Config} */
export default [
    ...configs,
    {
        files: ['**/ngx-material-entity/**/*.ts'],
        rules: {
            'angular/component-selector': [
                'warn',
                {
                    style: 'kebab-case',
                    type: 'element',
                    prefix: 'ngx-mat-entity'
                }
            ]
        }
    }
];