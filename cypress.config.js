const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  video: true,
  env:{
    username: "name",
    password: "password",
    apiUrl: "https://conduit-api.bondaracademy.com",
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  reporter: 'cypress-multi-reporters',
    reporterOptions: {
      configFile: 'reporter-config.json',
    },
  
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      const username = process.env.username || config.env.username;
      const password = process.env.password || config.env.password;

      if(!username || !password){
        throw new Error('Please provide username and password');
      }

      config.env = {username, password};
      return config;
    },
    baseUrl: 'https://conduit.bondaracademy.com/',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
  },
});
