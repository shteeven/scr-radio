'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('regulars', ['core']);
ApplicationConfiguration.registerModule('regulars.admin', ['core.admin']);
ApplicationConfiguration.registerModule('regulars.admin.routes', ['core.admin.routes']);
