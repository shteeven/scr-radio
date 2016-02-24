'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('shows', ['core']);
ApplicationConfiguration.registerModule('shows.admin', ['core.admin']);
ApplicationConfiguration.registerModule('shows.admin.routes', ['core.admin.routes']);
