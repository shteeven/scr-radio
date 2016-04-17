'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Special = mongoose.model('Special'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, special;

/**
 * Special routes tests
 */
describe('Special CRUD tests', function () {

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

    // Save a user to the test db and create new special
    user.save(function () {
      special = {
        title: 'Special Title',
        content: 'Special Content'
      };

      done();
    });
  });

  it('should be able to save an special if logged in', function (done) {
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

        // Save a new special
        agent.post('/api/specials')
          .send(special)
          .expect(200)
          .end(function (specialsaveErr, specialsaveRes) {
            // Handle special save error
            if (specialsaveErr) {
              return done(specialsaveErr);
            }

            // Get a list of specials
            agent.get('/api/specials')
              .end(function (specialsGetErr, specialsGetRes) {
                // Handle special save error
                if (specialsGetErr) {
                  return done(specialsGetErr);
                }

                // Get specials list
                var specials = specialsGetRes.body;

                // Set assertions
                (specials[0].user._id).should.equal(userId);
                (specials[0].title).should.match('Special Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an special if not logged in', function (done) {
    agent.post('/api/specials')
      .send(special)
      .expect(403)
      .end(function (specialsaveErr, specialsaveRes) {
        // Call the assertion callback
        done(specialsaveErr);
      });
  });

  it('should not be able to save an special if no title is provided', function (done) {
    // Invalidate title field
    special.title = '';

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

        // Save a new special
        agent.post('/api/specials')
          .send(special)
          .expect(400)
          .end(function (specialsaveErr, specialsaveRes) {
            // Set message assertion
            (specialsaveRes.body.message).should.match('Title cannot be blank');

            // Handle special save error
            done(specialsaveErr);
          });
      });
  });

  it('should be able to update an special if signed in', function (done) {
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

        // Save a new special
        agent.post('/api/specials')
          .send(special)
          .expect(200)
          .end(function (specialsaveErr, specialsaveRes) {
            // Handle special save error
            if (specialsaveErr) {
              return done(specialsaveErr);
            }

            // Update special title
            special.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing special
            agent.put('/api/specials/' + specialsaveRes.body._id)
              .send(special)
              .expect(200)
              .end(function (specialUpdateErr, specialUpdateRes) {
                // Handle special update error
                if (specialUpdateErr) {
                  return done(specialUpdateErr);
                }

                // Set assertions
                (specialUpdateRes.body._id).should.equal(specialsaveRes.body._id);
                (specialUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of specials if not signed in', function (done) {
    // Create new special model instance
    var specialObj = new Special(special);

    // Save the special
    specialObj.save(function () {
      // Request specials
      request(app).get('/api/specials')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single special if not signed in', function (done) {
    // Create new special model instance
    var specialObj = new Special(special);

    // Save the special
    specialObj.save(function () {
      request(app).get('/api/specials/' + specialObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', special.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single special with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/specials/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Special is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single special which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent special
    request(app).get('/api/specials/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No special with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an special if signed in', function (done) {
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

        // Save a new special
        agent.post('/api/specials')
          .send(special)
          .expect(200)
          .end(function (specialsaveErr, specialsaveRes) {
            // Handle special save error
            if (specialsaveErr) {
              return done(specialsaveErr);
            }

            // Delete an existing special
            agent.delete('/api/specials/' + specialsaveRes.body._id)
              .send(special)
              .expect(200)
              .end(function (specialDeleteErr, specialDeleteRes) {
                // Handle special error error
                if (specialDeleteErr) {
                  return done(specialDeleteErr);
                }

                // Set assertions
                (specialDeleteRes.body._id).should.equal(specialsaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an special if not signed in', function (done) {
    // Set special user
    special.user = user;

    // Create new special model instance
    var specialObj = new Special(special);

    // Save the special
    specialObj.save(function () {
      // Try deleting special
      request(app).delete('/api/specials/' + specialObj._id)
        .expect(403)
        .end(function (specialDeleteErr, specialDeleteRes) {
          // Set message assertion
          (specialDeleteRes.body.message).should.match('User is not authorized');

          // Handle special error error
          done(specialDeleteErr);
        });

    });
  });

  it('should be able to get a single special that has an orphaned user reference', function (done) {
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

          // Save a new special
          agent.post('/api/specials')
            .send(special)
            .expect(200)
            .end(function (specialsaveErr, specialsaveRes) {
              // Handle special save error
              if (specialsaveErr) {
                return done(specialsaveErr);
              }

              // Set assertions on new special
              (specialsaveRes.body.title).should.equal(special.title);
              should.exist(specialsaveRes.body.user);
              should.equal(specialsaveRes.body.user._id, orphanId);

              // force the special to have an orphaned user reference
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

                    // Get the special
                    agent.get('/api/specials/' + specialsaveRes.body._id)
                      .expect(200)
                      .end(function (specialInfoErr, specialInfoRes) {
                        // Handle special error
                        if (specialInfoErr) {
                          return done(specialInfoErr);
                        }

                        // Set assertions
                        (specialInfoRes.body._id).should.equal(specialsaveRes.body._id);
                        (specialInfoRes.body.title).should.equal(special.title);
                        should.equal(specialInfoRes.body.user, undefined);

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
      Special.remove().exec(done);
    });
  });
});
