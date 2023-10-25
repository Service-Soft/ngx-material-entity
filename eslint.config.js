import config from 'eslint-config-service-soft';

export default [
    ...config,
    {
        ignores: ["**/coverage/**"],
    }
]