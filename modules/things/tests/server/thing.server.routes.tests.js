'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Thing = mongoose.model('Thing'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, thing;

/**
 * Thing routes tests
 */
describe('Thing CRUD tests', function () {

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

    // Save a user to the test db and create new thing
    user.save(function () {
      thing = {
        title: 'Thing Title',
        content: 'Thing Content'
      };

      done();
    });
  });

  it('should be able to save an thing if logged in', function (done) {
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

        // Save a new thing
        agent.post('/api/things')
          .send(thing)
          .expect(200)
          .end(function (thingsaveErr, thingsaveRes) {
            // Handle thing save error
            if (thingsaveErr) {
              return done(thingsaveErr);
            }

            // Get a list of things
            agent.get('/api/things')
              .end(function (thingsGetErr, thingsGetRes) {
                // Handle thing save error
                if (thingsGetErr) {
                  return done(thingsGetErr);
                }

                // Get things list
                var things = thingsGetRes.body;

                // Set assertions
                (things[0].user._id).should.equal(userId);
                (things[0].title).should.match('Thing Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an thing if not logged in', function (done) {
    agent.post('/api/things')
      .send(thing)
      .expect(403)
      .end(function (thingsaveErr, thingsaveRes) {
        // Call the assertion callback
        done(thingsaveErr);
      });
  });

  it('should not be able to save an thing if no title is provided', function (done) {
    // Invalidate title field
    thing.title = '';

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

        // Save a new thing
        agent.post('/api/things')
          .send(thing)
          .expect(400)
          .end(function (thingsaveErr, thingsaveRes) {
            // Set message assertion
            (thingsaveRes.body.message).should.match('Title cannot be blank');

            // Handle thing save error
            done(thingsaveErr);
          });
      });
  });

  it('should be able to update an thing if signed in', function (done) {
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

        // Save a new thing
        agent.post('/api/things')
          .send(thing)
          .expect(200)
          .end(function (thingsaveErr, thingsaveRes) {
            // Handle thing save error
            if (thingsaveErr) {
              return done(thingsaveErr);
            }

            // Update thing title
            thing.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing thing
            agent.put('/api/things/' + thingsaveRes.body._id)
              .send(thing)
              .expect(200)
              .end(function (thingUpdateErr, thingUpdateRes) {
                // Handle thing update error
                if (thingUpdateErr) {
                  return done(thingUpdateErr);
                }

                // Set assertions
                (thingUpdateRes.body._id).should.equal(thingsaveRes.body._id);
                (thingUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of things if not signed in', function (done) {
    // Create new thing model instance
    var thingObj = new Thing(thing);

    // Save the thing
    thingObj.save(function () {
      // Request things
      request(app).get('/api/things')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single thing if not signed in', function (done) {
    // Create new thing model instance
    var thingObj = new Thing(thing);

    // Save the thing
    thingObj.save(function () {
      request(app).get('/api/things/' + thingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', thing.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single thing with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/things/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Thing is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single thing which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent thing
    request(app).get('/api/things/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No thing with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an thing if signed in', function (done) {
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

        // Save a new thing
        agent.post('/api/things')
          .send(thing)
          .expect(200)
          .end(function (thingsaveErr, thingsaveRes) {
            // Handle thing save error
            if (thingsaveErr) {
              return done(thingsaveErr);
            }

            // Delete an existing thing
            agent.delete('/api/things/' + thingsaveRes.body._id)
              .send(thing)
              .expect(200)
              .end(function (thingDeleteErr, thingDeleteRes) {
                // Handle thing error error
                if (thingDeleteErr) {
                  return done(thingDeleteErr);
                }

                // Set assertions
                (thingDeleteRes.body._id).should.equal(thingsaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an thing if not signed in', function (done) {
    // Set thing user
    thing.user = user;

    // Create new thing model instance
    var thingObj = new Thing(thing);

    // Save the thing
    thingObj.save(function () {
      // Try deleting thing
      request(app).delete('/api/things/' + thingObj._id)
        .expect(403)
        .end(function (thingDeleteErr, thingDeleteRes) {
          // Set message assertion
          (thingDeleteRes.body.message).should.match('User is not authorized');

          // Handle thing error error
          done(thingDeleteErr);
        });

    });
  });

  it('should be able to get a single thing that has an orphaned user reference', function (done) {
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

          // Save a new thing
          agent.post('/api/things')
            .send(thing)
            .expect(200)
            .end(function (thingsaveErr, thingsaveRes) {
              // Handle thing save error
              if (thingsaveErr) {
                return done(thingsaveErr);
              }

              // Set assertions on new thing
              (thingsaveRes.body.title).should.equal(thing.title);
              should.exist(thingsaveRes.body.user);
              should.equal(thingsaveRes.body.user._id, orphanId);

              // force the thing to have an orphaned user reference
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

                    // Get the thing
                    agent.get('/api/things/' + thingsaveRes.body._id)
                      .expect(200)
                      .end(function (thingInfoErr, thingInfoRes) {
                        // Handle thing error
                        if (thingInfoErr) {
                          return done(thingInfoErr);
                        }

                        // Set assertions
                        (thingInfoRes.body._id).should.equal(thingsaveRes.body._id);
                        (thingInfoRes.body.title).should.equal(thing.title);
                        should.equal(thingInfoRes.body.user, undefined);

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
      Thing.remove().exec(done);
    });
  });
});
