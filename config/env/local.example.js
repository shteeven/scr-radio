'use strict';

// Rename this file to local.js for having a local configuration variables that
// will not get commited and pushed to remote repositories.
// Use it for your API keys, passwords, etc.

/* For example:

module.exports = {
  db: {
    uri: 'mongodb://localhost/local-dev',
    options: {
      user: '',
      pass: ''
    }
  },
  sessionSecret: process.env.SESSION_SECRET || 'youshouldchangethistosomethingsecret',
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/facebook/callback'
  }
};
*/


// SCRadio implementation of local
module.exports = {
  MONGO_DB: 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/scradio',
  MONGO_USER: '',
  MONGO_PWD: '',
  SESSION_SECRET: '',
  MONGOLABURI: ''
};

