'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('episodes', ['core']);
ApplicationConfiguration.registerModule('episodes.admin', ['core.admin']);
ApplicationConfiguration.registerModule('episodes.admin.routes', ['core.admin.routes']);
