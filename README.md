
# Seoul Community Radio App

## Table of contents

  * [Introduction](#introduction)
  * [Prerequisites](#Prerequisites)
  * [Running your application with Gulp](#run-gulp)
    * [Running Gulp Development Environment](#run-gulp-dev)
    * [Running Gulp Production Environment](#run-gulp-prod)
    * [Testing Your Application with Gulp](#run-gulp-test)
    * [Running with TLS (SSL)](#run-gulp-tls)
  * [License](#License)

<a name="introduction"/>
## Introduction

SCRadio App is a full-stack JavaScript application that provides a live-stream player, mixcloud archive player, video streaming, and event/news pages that are all dynamically populated. 

It is built on the MEAN.JS stack, and set up with the Yeoman Generator for MEANJS version 0.4.2: 
* [MEAN.JS](http://meanjs.org/), 
* [MongoDB](http://www.mongodb.org/), 
* [Node.js](http://www.nodejs.org/), 
* [Express](http://expressjs.com/), 
* [AngularJS](http://angularjs.org/)
In addition to the MEAN.JS stack, the app utilizes [Heroku](http://www.heroku.com) and [MongoLab](http://www.mongolab.com) for deployment. 

The current 'in-development' version of the app can be found [here](http://www.seoulcommunityradio.herokuapp.com).

<a name="prerequisites"/>
## Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
  * Node v5 IS NOT SUPPORTED AT THIS TIME! 
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Ruby - [Download & Install Ruby](https://www.ruby-lang.org/en/documentation/installation/)
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

* Sass - You're going to use [Sass](http://sass-lang.com/) to compile CSS during your gulp task. Make sure you have ruby installed, and then install Sass using gem install:

```bash
$ gem install sass
```

* Gulp - Use Gulp for Live Reload, Linting, and SASS.

```bash
$ npm install gulp -g
```

Install Node.js dependencies. In the application folder run this in the command-line:

```bash
$ npm install
```

<a name="run-gulp"/>
## Running your application with Gulp

After the install process, you can easily run your project with:

```bash
$ gulp
```
or

```bash
$ gulp default
```

The server is now running on http://localhost:3000 if you are using the default settings. 

<a name="run-gulp-dev"/>
### Running Gulp Development Environment


Start the development environment with:

```bash
$ gulp dev
```

<a name="run-gulp-prod"/>
### Running Gulp Production Environment 

To run your application with *production* environment configuration, execute gulp as follows:

```bash
$ gulp prod
```

<a name="run-gulp-test"/>
### Testing Your Application with Gulp

Using the full test suite included with MEAN.JS with the test task:

##### Run all tests

```bash
$ gulp test
```

##### Run server tests

```bash
gulp test:server
```

##### Run client tests
```bash
gulp test:client
```

##### Run e2e tests
```bash
gulp test:e2e
```

<a name="run-tls"/>
### Running with TLS (SSL)

Application will start by default with secure configuration (SSL mode) turned on and listen on port 8443.
To run your application in a secure manner you'll need to use OpenSSL and generate a set of self-signed certificates. Unix-based users can use the following command:

```bash
$ sh ./scripts/generate-ssl-certs.sh
```

Windows users can follow instructions found [here](http://www.websense.com/support/article/kbarticle/How-to-use-OpenSSL-and-Microsoft-Certification-Authority).
After you've generated the key and certificate, place them in the *config/sslcerts* folder.

Finally, execute gulp's prod task `gulp prod`
* enable/disable SSL mode in production environment change the `secure` option in `config/env/production.js`

<a name="license"/>
## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



