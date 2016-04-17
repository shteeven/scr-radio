'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Regular = mongoose.model('Regular'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, regular;

/**
 * Regular routes tests
 */
describe('Regular CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new regular
    user.save(function () {
      regular = {
        title: 'Regular Title',
        content: 'Regular Content'
      };

      done();
    });
  });

  it('should be able to save an regular if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new regular
        agent.post('/api/regulars')
          .send(regular)
          .expect(200)
          .end(function (regularsaveErr, regularsaveRes) {
            // Handle regular save error
            if (regularsaveErr) {
              return done(regularsaveErr);
            }

            // Get a list of regulars
            agent.get('/api/regulars')
              .end(function (regularsGetErr, regularsGetRes) {
                // Handle regular save error
                if (regularsGetErr) {
                  return done(regularsGetErr);
                }

                // Get regulars list
                var regulars = regularsGetRes.body;

                // Set assertions
                (regulars[0].user._id).should.equal(userId);
                (regulars[0].title).should.match('Regular Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an regular if not logged in', function (done) {
    agent.post('/api/regulars')
      .send(regular)
      .expect(403)
      .end(function (regularsaveErr, regularsaveRes) {
        // Call the assertion callback
        done(regularsaveErr);
      });
  });

  it('should not be able to save an regular if no title is provided', function (done) {
    // Invalidate title field
    regular.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new regular
        agent.post('/api/regulars')
          .send(regular)
          .expect(400)
          .end(function (regularsaveErr, regularsaveRes) {
            // Set message assertion
            (regularsaveRes.body.message).should.match('Title cannot be blank');

            // Handle regular save error
            done(regularsaveErr);
          });
      });
  });

  it('should be able to update an regular if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new regular
        agent.post('/api/regulars')
          .send(regular)
          .expect(200)
          .end(function (regularsaveErr, regularsaveRes) {
            // Handle regular save error
            if (regularsaveErr) {
              return done(regularsaveErr);
            }

            // Update regular title
            regular.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing regular
            agent.put('/api/regulars/' + regularsaveRes.body._id)
              .send(regular)
              .expect(200)
              .end(function (regularUpdateErr, regularUpdateRes) {
                // Handle regular update error
                if (regularUpdateErr) {
                  return done(regularUpdateErr);
                }

                // Set assertions
                (regularUpdateRes.body._id).should.equal(regularsaveRes.body._id);
                (regularUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of regulars if not signed in', function (done) {
    // Create new regular model instance
    var regularObj = new Regular(regular);

    // Save the regular
    regularObj.save(function () {
      // Request regulars
      request(app).get('/api/regulars')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single regular if not signed in', function (done) {
    // Create new regular model instance
    var regularObj = new Regular(regular);

    // Save the regular
    regularObj.save(function () {
      request(app).get('/api/regulars/' + regularObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', regular.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single regular with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/regulars/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Regular is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single regular which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent regular
    request(app).get('/api/regulars/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No regular with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an regular if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new regular
        agent.post('/api/regulars')
          .send(regular)
          .expect(200)
          .end(function (regularsaveErr, regularsaveRes) {
            // Handle regular save error
            if (regularsaveErr) {
              return done(regularsaveErr);
            }

            // Delete an existing regular
            agent.delete('/api/regulars/' + regularsaveRes.body._id)
              .send(regular)
              .expect(200)
              .end(function (regularDeleteErr, regularDeleteRes) {
                // Handle regular error error
                if (regularDeleteErr) {
                  return done(regularDeleteErr);
                }

                // Set assertions
                (regularDeleteRes.body._id).should.equal(regularsaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an regular if not signed in', function (done) {
    // Set regular user
    regular.user = user;

    // Create new regular model instance
    var regularObj = new Regular(regular);

    // Save the regular
    regularObj.save(function () {
      // Try deleting regular
      request(app).delete('/api/regulars/' + regularObj._id)
        .expect(403)
        .end(function (regularDeleteErr, regularDeleteRes) {
          // Set message assertion
          (regularDeleteRes.body.message).should.match('User is not authorized');

          // Handle regular error error
          done(regularDeleteErr);
        });

    });
  });

  it('should be able to get a single regular that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new regular
          agent.post('/api/regulars')
            .send(regular)
            .expect(200)
            .end(function (regularsaveErr, regularsaveRes) {
              // Handle regular save error
              if (regularsaveErr) {
                return done(regularsaveErr);
              }

              // Set assertions on new regular
              (regularsaveRes.body.title).should.equal(regular.title);
              should.exist(regularsaveRes.body.user);
              should.equal(regularsaveRes.body.user._id, orphanId);

              // force the regular to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the regular
                    agent.get('/api/regulars/' + regularsaveRes.body._id)
                      .expect(200)
                      .end(function (regularInfoErr, regularInfoRes) {
                        // Handle regular error
                        if (regularInfoErr) {
                          return done(regularInfoErr);
                        }

                        // Set assertions
                        (regularInfoRes.body._id).should.equal(regularsaveRes.body._id);
                        (regularInfoRes.body.title).should.equal(regular.title);
                        should.equal(regularInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Regular.remove().exec(done);
    });
  });
});
