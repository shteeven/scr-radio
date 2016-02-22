'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Star = mongoose.model('Star'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, star;

/**
 * Star routes tests
 */
describe('Star CRUD tests', function () {

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

    // Save a user to the test db and create new star
    user.save(function () {
      star = {
        title: 'Star Title',
        content: 'Star Content'
      };

      done();
    });
  });

  it('should be able to save an star if logged in', function (done) {
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

        // Save a new star
        agent.post('/api/stars')
          .send(star)
          .expect(200)
          .end(function (starSaveErr, starSaveRes) {
            // Handle star save error
            if (starSaveErr) {
              return done(starSaveErr);
            }

            // Get a list of stars
            agent.get('/api/stars')
              .end(function (starsGetErr, starsGetRes) {
                // Handle star save error
                if (starsGetErr) {
                  return done(starsGetErr);
                }

                // Get stars list
                var stars = starsGetRes.body;

                // Set assertions
                (stars[0].user._id).should.equal(userId);
                (stars[0].title).should.match('Star Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an star if not logged in', function (done) {
    agent.post('/api/stars')
      .send(star)
      .expect(403)
      .end(function (starSaveErr, starSaveRes) {
        // Call the assertion callback
        done(starSaveErr);
      });
  });

  it('should not be able to save an star if no title is provided', function (done) {
    // Invalidate title field
    star.title = '';

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

        // Save a new star
        agent.post('/api/stars')
          .send(star)
          .expect(400)
          .end(function (starSaveErr, starSaveRes) {
            // Set message assertion
            (starSaveRes.body.message).should.match('Title cannot be blank');

            // Handle star save error
            done(starSaveErr);
          });
      });
  });

  it('should be able to update an star if signed in', function (done) {
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

        // Save a new star
        agent.post('/api/stars')
          .send(star)
          .expect(200)
          .end(function (starSaveErr, starSaveRes) {
            // Handle star save error
            if (starSaveErr) {
              return done(starSaveErr);
            }

            // Update star title
            star.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing star
            agent.put('/api/stars/' + starSaveRes.body._id)
              .send(star)
              .expect(200)
              .end(function (starUpdateErr, starUpdateRes) {
                // Handle star update error
                if (starUpdateErr) {
                  return done(starUpdateErr);
                }

                // Set assertions
                (starUpdateRes.body._id).should.equal(starSaveRes.body._id);
                (starUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of stars if not signed in', function (done) {
    // Create new star model instance
    var starObj = new Star(star);

    // Save the star
    starObj.save(function () {
      // Request stars
      request(app).get('/api/stars')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single star if not signed in', function (done) {
    // Create new star model instance
    var starObj = new Star(star);

    // Save the star
    starObj.save(function () {
      request(app).get('/api/stars/' + starObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', star.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single star with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/stars/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Star is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single star which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent star
    request(app).get('/api/stars/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No star with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an star if signed in', function (done) {
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

        // Save a new star
        agent.post('/api/stars')
          .send(star)
          .expect(200)
          .end(function (starSaveErr, starSaveRes) {
            // Handle star save error
            if (starSaveErr) {
              return done(starSaveErr);
            }

            // Delete an existing star
            agent.delete('/api/stars/' + starSaveRes.body._id)
              .send(star)
              .expect(200)
              .end(function (starDeleteErr, starDeleteRes) {
                // Handle star error error
                if (starDeleteErr) {
                  return done(starDeleteErr);
                }

                // Set assertions
                (starDeleteRes.body._id).should.equal(starSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an star if not signed in', function (done) {
    // Set star user
    star.user = user;

    // Create new star model instance
    var starObj = new Star(star);

    // Save the star
    starObj.save(function () {
      // Try deleting star
      request(app).delete('/api/stars/' + starObj._id)
        .expect(403)
        .end(function (starDeleteErr, starDeleteRes) {
          // Set message assertion
          (starDeleteRes.body.message).should.match('User is not authorized');

          // Handle star error error
          done(starDeleteErr);
        });

    });
  });

  it('should be able to get a single star that has an orphaned user reference', function (done) {
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

          // Save a new star
          agent.post('/api/stars')
            .send(star)
            .expect(200)
            .end(function (starSaveErr, starSaveRes) {
              // Handle star save error
              if (starSaveErr) {
                return done(starSaveErr);
              }

              // Set assertions on new star
              (starSaveRes.body.title).should.equal(star.title);
              should.exist(starSaveRes.body.user);
              should.equal(starSaveRes.body.user._id, orphanId);

              // force the star to have an orphaned user reference
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

                    // Get the star
                    agent.get('/api/stars/' + starSaveRes.body._id)
                      .expect(200)
                      .end(function (starInfoErr, starInfoRes) {
                        // Handle star error
                        if (starInfoErr) {
                          return done(starInfoErr);
                        }

                        // Set assertions
                        (starInfoRes.body._id).should.equal(starSaveRes.body._id);
                        (starInfoRes.body.title).should.equal(star.title);
                        should.equal(starInfoRes.body.user, undefined);

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
      Star.remove().exec(done);
    });
  });
});
