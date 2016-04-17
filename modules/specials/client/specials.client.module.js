'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('specials', ['core']);
ApplicationConfiguration.registerModule('specials.admin', ['core.admin']);
ApplicationConfiguration.registerModule('specials.admin.routes', ['core.admin.routes']);
