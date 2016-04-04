'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('things', ['core']);
ApplicationConfiguration.registerModule('things.admin', ['core.admin']);
ApplicationConfiguration.registerModule('things.admin.routes', ['core.admin.routes']);
