const { defineConfig } = require("cypress");

module.exports = defineConfig({
    viewportWidth: 1600,
    viewportHeight: 1000,

    env: {
        codeCoverage: {
            url: "http://localhost:7357/__coverage__",
        },
    },

    e2e: {
        specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        setupNodeEvents(on, config) {
            return require("./cypress/plugins/index.js")(on, config);
        },
        baseUrl: "http://localhost:7357",
    },
});
