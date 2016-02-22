'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Dj = mongoose.model('Dj'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, dj;

/**
 * Dj routes tests
 */
describe('Dj CRUD tests', function () {

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

    // Save a user to the test db and create new dj
    user.save(function () {
      dj = {
        title: 'Dj Title',
        content: 'Dj Content'
      };

      done();
    });
  });

  it('should be able to save an dj if logged in', function (done) {
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

        // Save a new dj
        agent.post('/api/djs')
          .send(dj)
          .expect(200)
          .end(function (djsaveErr, djsaveRes) {
            // Handle dj save error
            if (djsaveErr) {
              return done(djsaveErr);
            }

            // Get a list of djs
            agent.get('/api/djs')
              .end(function (djsGetErr, djsGetRes) {
                // Handle dj save error
                if (djsGetErr) {
                  return done(djsGetErr);
                }

                // Get djs list
                var djs = djsGetRes.body;

                // Set assertions
                (djs[0].user._id).should.equal(userId);
                (djs[0].title).should.match('Dj Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an dj if not logged in', function (done) {
    agent.post('/api/djs')
      .send(dj)
      .expect(403)
      .end(function (djsaveErr, djsaveRes) {
        // Call the assertion callback
        done(djsaveErr);
      });
  });

  it('should not be able to save an dj if no title is provided', function (done) {
    // Invalidate title field
    dj.title = '';

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

        // Save a new dj
        agent.post('/api/djs')
          .send(dj)
          .expect(400)
          .end(function (djsaveErr, djsaveRes) {
            // Set message assertion
            (djsaveRes.body.message).should.match('Title cannot be blank');

            // Handle dj save error
            done(djsaveErr);
          });
      });
  });

  it('should be able to update an dj if signed in', function (done) {
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

        // Save a new dj
        agent.post('/api/djs')
          .send(dj)
          .expect(200)
          .end(function (djsaveErr, djsaveRes) {
            // Handle dj save error
            if (djsaveErr) {
              return done(djsaveErr);
            }

            // Update dj title
            dj.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing dj
            agent.put('/api/djs/' + djsaveRes.body._id)
              .send(dj)
              .expect(200)
              .end(function (djUpdateErr, djUpdateRes) {
                // Handle dj update error
                if (djUpdateErr) {
                  return done(djUpdateErr);
                }

                // Set assertions
                (djUpdateRes.body._id).should.equal(djsaveRes.body._id);
                (djUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of djs if not signed in', function (done) {
    // Create new dj model instance
    var djObj = new Dj(dj);

    // Save the dj
    djObj.save(function () {
      // Request djs
      request(app).get('/api/djs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single dj if not signed in', function (done) {
    // Create new dj model instance
    var djObj = new Dj(dj);

    // Save the dj
    djObj.save(function () {
      request(app).get('/api/djs/' + djObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', dj.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single dj with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/djs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Dj is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single dj which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent dj
    request(app).get('/api/djs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No dj with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an dj if signed in', function (done) {
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

        // Save a new dj
        agent.post('/api/djs')
          .send(dj)
          .expect(200)
          .end(function (djsaveErr, djsaveRes) {
            // Handle dj save error
            if (djsaveErr) {
              return done(djsaveErr);
            }

            // Delete an existing dj
            agent.delete('/api/djs/' + djsaveRes.body._id)
              .send(dj)
              .expect(200)
              .end(function (djDeleteErr, djDeleteRes) {
                // Handle dj error error
                if (djDeleteErr) {
                  return done(djDeleteErr);
                }

                // Set assertions
                (djDeleteRes.body._id).should.equal(djsaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an dj if not signed in', function (done) {
    // Set dj user
    dj.user = user;

    // Create new dj model instance
    var djObj = new Dj(dj);

    // Save the dj
    djObj.save(function () {
      // Try deleting dj
      request(app).delete('/api/djs/' + djObj._id)
        .expect(403)
        .end(function (djDeleteErr, djDeleteRes) {
          // Set message assertion
          (djDeleteRes.body.message).should.match('User is not authorized');

          // Handle dj error error
          done(djDeleteErr);
        });

    });
  });

  it('should be able to get a single dj that has an orphaned user reference', function (done) {
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

          // Save a new dj
          agent.post('/api/djs')
            .send(dj)
            .expect(200)
            .end(function (djsaveErr, djsaveRes) {
              // Handle dj save error
              if (djsaveErr) {
                return done(djsaveErr);
              }

              // Set assertions on new dj
              (djsaveRes.body.title).should.equal(dj.title);
              should.exist(djsaveRes.body.user);
              should.equal(djsaveRes.body.user._id, orphanId);

              // force the dj to have an orphaned user reference
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

                    // Get the dj
                    agent.get('/api/djs/' + djsaveRes.body._id)
                      .expect(200)
                      .end(function (djInfoErr, djInfoRes) {
                        // Handle dj error
                        if (djInfoErr) {
                          return done(djInfoErr);
                        }

                        // Set assertions
                        (djInfoRes.body._id).should.equal(djsaveRes.body._id);
                        (djInfoRes.body.title).should.equal(dj.title);
                        should.equal(djInfoRes.body.user, undefined);

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
      Dj.remove().exec(done);
    });
  });
});
