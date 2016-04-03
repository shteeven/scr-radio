'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Episode = mongoose.model('Episode'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, episode;

/**
 * Episode routes tests
 */
describe('Episode CRUD tests', function () {

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

    // Save a user to the test db and create new episode
    user.save(function () {
      episode = {
        title: 'Episode Title',
        content: 'Episode Content'
      };

      done();
    });
  });

  it('should be able to save an episode if logged in', function (done) {
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

        // Save a new episode
        agent.post('/api/episodes')
          .send(episode)
          .expect(200)
          .end(function (episodesaveErr, episodesaveRes) {
            // Handle episode save error
            if (episodesaveErr) {
              return done(episodesaveErr);
            }

            // Get a list of episodes
            agent.get('/api/episodes')
              .end(function (episodesGetErr, episodesGetRes) {
                // Handle episode save error
                if (episodesGetErr) {
                  return done(episodesGetErr);
                }

                // Get episodes list
                var episodes = episodesGetRes.body;

                // Set assertions
                (episodes[0].user._id).should.equal(userId);
                (episodes[0].title).should.match('Episode Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an episode if not logged in', function (done) {
    agent.post('/api/episodes')
      .send(episode)
      .expect(403)
      .end(function (episodesaveErr, episodesaveRes) {
        // Call the assertion callback
        done(episodesaveErr);
      });
  });

  it('should not be able to save an episode if no title is provided', function (done) {
    // Invalidate title field
    episode.title = '';

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

        // Save a new episode
        agent.post('/api/episodes')
          .send(episode)
          .expect(400)
          .end(function (episodesaveErr, episodesaveRes) {
            // Set message assertion
            (episodesaveRes.body.message).should.match('Title cannot be blank');

            // Handle episode save error
            done(episodesaveErr);
          });
      });
  });

  it('should be able to update an episode if signed in', function (done) {
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

        // Save a new episode
        agent.post('/api/episodes')
          .send(episode)
          .expect(200)
          .end(function (episodesaveErr, episodesaveRes) {
            // Handle episode save error
            if (episodesaveErr) {
              return done(episodesaveErr);
            }

            // Update episode title
            episode.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing episode
            agent.put('/api/episodes/' + episodesaveRes.body._id)
              .send(episode)
              .expect(200)
              .end(function (episodeUpdateErr, episodeUpdateRes) {
                // Handle episode update error
                if (episodeUpdateErr) {
                  return done(episodeUpdateErr);
                }

                // Set assertions
                (episodeUpdateRes.body._id).should.equal(episodesaveRes.body._id);
                (episodeUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of episodes if not signed in', function (done) {
    // Create new episode model instance
    var episodeObj = new Episode(episode);

    // Save the episode
    episodeObj.save(function () {
      // Request episodes
      request(app).get('/api/episodes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single episode if not signed in', function (done) {
    // Create new episode model instance
    var episodeObj = new Episode(episode);

    // Save the episode
    episodeObj.save(function () {
      request(app).get('/api/episodes/' + episodeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', episode.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single episode with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/episodes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Episode is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single episode which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent episode
    request(app).get('/api/episodes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No episode with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an episode if signed in', function (done) {
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

        // Save a new episode
        agent.post('/api/episodes')
          .send(episode)
          .expect(200)
          .end(function (episodesaveErr, episodesaveRes) {
            // Handle episode save error
            if (episodesaveErr) {
              return done(episodesaveErr);
            }

            // Delete an existing episode
            agent.delete('/api/episodes/' + episodesaveRes.body._id)
              .send(episode)
              .expect(200)
              .end(function (episodeDeleteErr, episodeDeleteRes) {
                // Handle episode error error
                if (episodeDeleteErr) {
                  return done(episodeDeleteErr);
                }

                // Set assertions
                (episodeDeleteRes.body._id).should.equal(episodesaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an episode if not signed in', function (done) {
    // Set episode user
    episode.user = user;

    // Create new episode model instance
    var episodeObj = new Episode(episode);

    // Save the episode
    episodeObj.save(function () {
      // Try deleting episode
      request(app).delete('/api/episodes/' + episodeObj._id)
        .expect(403)
        .end(function (episodeDeleteErr, episodeDeleteRes) {
          // Set message assertion
          (episodeDeleteRes.body.message).should.match('User is not authorized');

          // Handle episode error error
          done(episodeDeleteErr);
        });

    });
  });

  it('should be able to get a single episode that has an orphaned user reference', function (done) {
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

          // Save a new episode
          agent.post('/api/episodes')
            .send(episode)
            .expect(200)
            .end(function (episodesaveErr, episodesaveRes) {
              // Handle episode save error
              if (episodesaveErr) {
                return done(episodesaveErr);
              }

              // Set assertions on new episode
              (episodesaveRes.body.title).should.equal(episode.title);
              should.exist(episodesaveRes.body.user);
              should.equal(episodesaveRes.body.user._id, orphanId);

              // force the episode to have an orphaned user reference
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

                    // Get the episode
                    agent.get('/api/episodes/' + episodesaveRes.body._id)
                      .expect(200)
                      .end(function (episodeInfoErr, episodeInfoRes) {
                        // Handle episode error
                        if (episodeInfoErr) {
                          return done(episodeInfoErr);
                        }

                        // Set assertions
                        (episodeInfoRes.body._id).should.equal(episodesaveRes.body._id);
                        (episodeInfoRes.body.title).should.equal(episode.title);
                        should.equal(episodeInfoRes.body.user, undefined);

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
      Episode.remove().exec(done);
    });
  });
});
