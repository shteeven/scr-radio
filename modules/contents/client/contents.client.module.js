'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('contents', ['core']);
ApplicationConfiguration.registerModule('contents.admin', ['core.admin']);
ApplicationConfiguration.registerModule('contents.admin.routes', ['core.admin.routes']);
