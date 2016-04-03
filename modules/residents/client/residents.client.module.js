'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('residents', ['core']);
ApplicationConfiguration.registerModule('residents.admin', ['core.admin']);
ApplicationConfiguration.registerModule('residents.admin.routes', ['core.admin.routes']);
