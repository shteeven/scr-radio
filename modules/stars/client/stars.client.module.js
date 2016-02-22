'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('stars', ['core']);
ApplicationConfiguration.registerModule('stars.admin', ['core.admin']);
ApplicationConfiguration.registerModule('stars.admin.routes', ['core.admin.routes']);
