'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Show = mongoose.model('Show'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, show;

/**
 * Show routes tests
 */
describe('Show CRUD tests', function () {

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

    // Save a user to the test db and create new show
    user.save(function () {
      show = {
        title: 'Show Title',
        content: 'Show Content'
      };

      done();
    });
  });

  it('should be able to save an show if logged in', function (done) {
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

        // Save a new show
        agent.post('/api/shows')
          .send(show)
          .expect(200)
          .end(function (showsaveErr, showsaveRes) {
            // Handle show save error
            if (showsaveErr) {
              return done(showsaveErr);
            }

            // Get a list of shows
            agent.get('/api/shows')
              .end(function (showsGetErr, showsGetRes) {
                // Handle show save error
                if (showsGetErr) {
                  return done(showsGetErr);
                }

                // Get shows list
                var shows = showsGetRes.body;

                // Set assertions
                (shows[0].user._id).should.equal(userId);
                (shows[0].title).should.match('Show Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an show if not logged in', function (done) {
    agent.post('/api/shows')
      .send(show)
      .expect(403)
      .end(function (showsaveErr, showsaveRes) {
        // Call the assertion callback
        done(showsaveErr);
      });
  });

  it('should not be able to save an show if no title is provided', function (done) {
    // Invalidate title field
    show.title = '';

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

        // Save a new show
        agent.post('/api/shows')
          .send(show)
          .expect(400)
          .end(function (showsaveErr, showsaveRes) {
            // Set message assertion
            (showsaveRes.body.message).should.match('Title cannot be blank');

            // Handle show save error
            done(showsaveErr);
          });
      });
  });

  it('should be able to update an show if signed in', function (done) {
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

        // Save a new show
        agent.post('/api/shows')
          .send(show)
          .expect(200)
          .end(function (showsaveErr, showsaveRes) {
            // Handle show save error
            if (showsaveErr) {
              return done(showsaveErr);
            }

            // Update show title
            show.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing show
            agent.put('/api/shows/' + showsaveRes.body._id)
              .send(show)
              .expect(200)
              .end(function (showUpdateErr, showUpdateRes) {
                // Handle show update error
                if (showUpdateErr) {
                  return done(showUpdateErr);
                }

                // Set assertions
                (showUpdateRes.body._id).should.equal(showsaveRes.body._id);
                (showUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of shows if not signed in', function (done) {
    // Create new show model instance
    var showObj = new Show(show);

    // Save the show
    showObj.save(function () {
      // Request shows
      request(app).get('/api/shows')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single show if not signed in', function (done) {
    // Create new show model instance
    var showObj = new Show(show);

    // Save the show
    showObj.save(function () {
      request(app).get('/api/shows/' + showObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', show.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single show with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/shows/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Show is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single show which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent show
    request(app).get('/api/shows/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No show with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an show if signed in', function (done) {
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

        // Save a new show
        agent.post('/api/shows')
          .send(show)
          .expect(200)
          .end(function (showsaveErr, showsaveRes) {
            // Handle show save error
            if (showsaveErr) {
              return done(showsaveErr);
            }

            // Delete an existing show
            agent.delete('/api/shows/' + showsaveRes.body._id)
              .send(show)
              .expect(200)
              .end(function (showDeleteErr, showDeleteRes) {
                // Handle show error error
                if (showDeleteErr) {
                  return done(showDeleteErr);
                }

                // Set assertions
                (showDeleteRes.body._id).should.equal(showsaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an show if not signed in', function (done) {
    // Set show user
    show.user = user;

    // Create new show model instance
    var showObj = new Show(show);

    // Save the show
    showObj.save(function () {
      // Try deleting show
      request(app).delete('/api/shows/' + showObj._id)
        .expect(403)
        .end(function (showDeleteErr, showDeleteRes) {
          // Set message assertion
          (showDeleteRes.body.message).should.match('User is not authorized');

          // Handle show error error
          done(showDeleteErr);
        });

    });
  });

  it('should be able to get a single show that has an orphaned user reference', function (done) {
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

          // Save a new show
          agent.post('/api/shows')
            .send(show)
            .expect(200)
            .end(function (showsaveErr, showsaveRes) {
              // Handle show save error
              if (showsaveErr) {
                return done(showsaveErr);
              }

              // Set assertions on new show
              (showsaveRes.body.title).should.equal(show.title);
              should.exist(showsaveRes.body.user);
              should.equal(showsaveRes.body.user._id, orphanId);

              // force the show to have an orphaned user reference
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

                    // Get the show
                    agent.get('/api/shows/' + showsaveRes.body._id)
                      .expect(200)
                      .end(function (showInfoErr, showInfoRes) {
                        // Handle show error
                        if (showInfoErr) {
                          return done(showInfoErr);
                        }

                        // Set assertions
                        (showInfoRes.body._id).should.equal(showsaveRes.body._id);
                        (showInfoRes.body.title).should.equal(show.title);
                        should.equal(showInfoRes.body.user, undefined);

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
      Show.remove().exec(done);
    });
  });
});
