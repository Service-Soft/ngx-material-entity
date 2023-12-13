const config = require('eslint-config-service-soft');

module.exports = [
    ...config,
    {
        files: ['**/ngx-material-entity/**/*.ts'],
        rules: {
            'angular/component-selector': [
                'warn',
                {
                    'style': 'kebab-case',
                    'type': 'element',
                    'prefix': 'ngx-mat-entity'
                }
            ]
        }
    }
];