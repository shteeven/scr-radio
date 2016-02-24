'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('programs', ['core']);
ApplicationConfiguration.registerModule('programs.admin', ['core.admin']);
ApplicationConfiguration.registerModule('programs.admin.routes', ['core.admin.routes']);
