'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('djs', ['core']);
ApplicationConfiguration.registerModule('djs.admin', ['core.admin']);
ApplicationConfiguration.registerModule('djs.admin.routes', ['core.admin.routes']);
