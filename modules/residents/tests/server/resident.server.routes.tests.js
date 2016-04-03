'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Resident = mongoose.model('Resident'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, resident;

/**
 * Resident routes tests
 */
describe('Resident CRUD tests', function () {

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

    // Save a user to the test db and create new resident
    user.save(function () {
      resident = {
        title: 'Resident Title',
        content: 'Resident Content'
      };

      done();
    });
  });

  it('should be able to save an resident if logged in', function (done) {
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

        // Save a new resident
        agent.post('/api/residents')
          .send(resident)
          .expect(200)
          .end(function (residentsaveErr, residentsaveRes) {
            // Handle resident save error
            if (residentsaveErr) {
              return done(residentsaveErr);
            }

            // Get a list of residents
            agent.get('/api/residents')
              .end(function (residentsGetErr, residentsGetRes) {
                // Handle resident save error
                if (residentsGetErr) {
                  return done(residentsGetErr);
                }

                // Get residents list
                var residents = residentsGetRes.body;

                // Set assertions
                (residents[0].user._id).should.equal(userId);
                (residents[0].title).should.match('Resident Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an resident if not logged in', function (done) {
    agent.post('/api/residents')
      .send(resident)
      .expect(403)
      .end(function (residentsaveErr, residentsaveRes) {
        // Call the assertion callback
        done(residentsaveErr);
      });
  });

  it('should not be able to save an resident if no title is provided', function (done) {
    // Invalidate title field
    resident.title = '';

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

        // Save a new resident
        agent.post('/api/residents')
          .send(resident)
          .expect(400)
          .end(function (residentsaveErr, residentsaveRes) {
            // Set message assertion
            (residentsaveRes.body.message).should.match('Title cannot be blank');

            // Handle resident save error
            done(residentsaveErr);
          });
      });
  });

  it('should be able to update an resident if signed in', function (done) {
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

        // Save a new resident
        agent.post('/api/residents')
          .send(resident)
          .expect(200)
          .end(function (residentsaveErr, residentsaveRes) {
            // Handle resident save error
            if (residentsaveErr) {
              return done(residentsaveErr);
            }

            // Update resident title
            resident.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing resident
            agent.put('/api/residents/' + residentsaveRes.body._id)
              .send(resident)
              .expect(200)
              .end(function (residentUpdateErr, residentUpdateRes) {
                // Handle resident update error
                if (residentUpdateErr) {
                  return done(residentUpdateErr);
                }

                // Set assertions
                (residentUpdateRes.body._id).should.equal(residentsaveRes.body._id);
                (residentUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of residents if not signed in', function (done) {
    // Create new resident model instance
    var residentObj = new Resident(resident);

    // Save the resident
    residentObj.save(function () {
      // Request residents
      request(app).get('/api/residents')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single resident if not signed in', function (done) {
    // Create new resident model instance
    var residentObj = new Resident(resident);

    // Save the resident
    residentObj.save(function () {
      request(app).get('/api/residents/' + residentObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', resident.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single resident with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/residents/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Resident is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single resident which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent resident
    request(app).get('/api/residents/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No resident with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an resident if signed in', function (done) {
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

        // Save a new resident
        agent.post('/api/residents')
          .send(resident)
          .expect(200)
          .end(function (residentsaveErr, residentsaveRes) {
            // Handle resident save error
            if (residentsaveErr) {
              return done(residentsaveErr);
            }

            // Delete an existing resident
            agent.delete('/api/residents/' + residentsaveRes.body._id)
              .send(resident)
              .expect(200)
              .end(function (residentDeleteErr, residentDeleteRes) {
                // Handle resident error error
                if (residentDeleteErr) {
                  return done(residentDeleteErr);
                }

                // Set assertions
                (residentDeleteRes.body._id).should.equal(residentsaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an resident if not signed in', function (done) {
    // Set resident user
    resident.user = user;

    // Create new resident model instance
    var residentObj = new Resident(resident);

    // Save the resident
    residentObj.save(function () {
      // Try deleting resident
      request(app).delete('/api/residents/' + residentObj._id)
        .expect(403)
        .end(function (residentDeleteErr, residentDeleteRes) {
          // Set message assertion
          (residentDeleteRes.body.message).should.match('User is not authorized');

          // Handle resident error error
          done(residentDeleteErr);
        });

    });
  });

  it('should be able to get a single resident that has an orphaned user reference', function (done) {
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

          // Save a new resident
          agent.post('/api/residents')
            .send(resident)
            .expect(200)
            .end(function (residentsaveErr, residentsaveRes) {
              // Handle resident save error
              if (residentsaveErr) {
                return done(residentsaveErr);
              }

              // Set assertions on new resident
              (residentsaveRes.body.title).should.equal(resident.title);
              should.exist(residentsaveRes.body.user);
              should.equal(residentsaveRes.body.user._id, orphanId);

              // force the resident to have an orphaned user reference
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

                    // Get the resident
                    agent.get('/api/residents/' + residentsaveRes.body._id)
                      .expect(200)
                      .end(function (residentInfoErr, residentInfoRes) {
                        // Handle resident error
                        if (residentInfoErr) {
                          return done(residentInfoErr);
                        }

                        // Set assertions
                        (residentInfoRes.body._id).should.equal(residentsaveRes.body._id);
                        (residentInfoRes.body.title).should.equal(resident.title);
                        should.equal(residentInfoRes.body.user, undefined);

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
      Resident.remove().exec(done);
    });
  });
});
