const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  video: true,
  env:{
    username: "jim@test.com",
    password: "jim",
    apiUrl: "https://conduit-api.bondaracademy.com",
  },
  
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://conduit.bondaracademy.com/',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
  },
});
