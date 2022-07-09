import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
            // include any other plugin code...

            // It's IMPORTANT to return the config object
            // with any changed environment variables
            return config
        }
    },
});