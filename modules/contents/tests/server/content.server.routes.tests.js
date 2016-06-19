'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Content = mongoose.model('Content'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, content;

/**
 * Content routes tests
 */
describe('Content CRUD tests', function () {

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

    // Save a user to the test db and create new content
    user.save(function () {
      content = {
        title: 'Content Title',
        content: 'Content Content'
      };

      done();
    });
  });

  it('should be able to save an content if logged in', function (done) {
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

        // Save a new content
        agent.post('/api/contents')
          .send(content)
          .expect(200)
          .end(function (contentsaveErr, contentsaveRes) {
            // Handle content save error
            if (contentsaveErr) {
              return done(contentsaveErr);
            }

            // Get a list of contents
            agent.get('/api/contents')
              .end(function (contentsGetErr, contentsGetRes) {
                // Handle content save error
                if (contentsGetErr) {
                  return done(contentsGetErr);
                }

                // Get contents list
                var contents = contentsGetRes.body;

                // Set assertions
                (contents[0].user._id).should.equal(userId);
                (contents[0].title).should.match('Content Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an content if not logged in', function (done) {
    agent.post('/api/contents')
      .send(content)
      .expect(403)
      .end(function (contentsaveErr, contentsaveRes) {
        // Call the assertion callback
        done(contentsaveErr);
      });
  });

  it('should not be able to save an content if no title is provided', function (done) {
    // Invalidate title field
    content.title = '';

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

        // Save a new content
        agent.post('/api/contents')
          .send(content)
          .expect(400)
          .end(function (contentsaveErr, contentsaveRes) {
            // Set message assertion
            (contentsaveRes.body.message).should.match('Title cannot be blank');

            // Handle content save error
            done(contentsaveErr);
          });
      });
  });

  it('should be able to update an content if signed in', function (done) {
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

        // Save a new content
        agent.post('/api/contents')
          .send(content)
          .expect(200)
          .end(function (contentsaveErr, contentsaveRes) {
            // Handle content save error
            if (contentsaveErr) {
              return done(contentsaveErr);
            }

            // Update content title
            content.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing content
            agent.put('/api/contents/' + contentsaveRes.body._id)
              .send(content)
              .expect(200)
              .end(function (contentUpdateErr, contentUpdateRes) {
                // Handle content update error
                if (contentUpdateErr) {
                  return done(contentUpdateErr);
                }

                // Set assertions
                (contentUpdateRes.body._id).should.equal(contentsaveRes.body._id);
                (contentUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of contents if not signed in', function (done) {
    // Create new content model instance
    var contentObj = new Content(content);

    // Save the content
    contentObj.save(function () {
      // Request contents
      request(app).get('/api/contents')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single content if not signed in', function (done) {
    // Create new content model instance
    var contentObj = new Content(content);

    // Save the content
    contentObj.save(function () {
      request(app).get('/api/contents/' + contentObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', content.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single content with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/contents/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Content is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single content which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent content
    request(app).get('/api/contents/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No content with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an content if signed in', function (done) {
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

        // Save a new content
        agent.post('/api/contents')
          .send(content)
          .expect(200)
          .end(function (contentsaveErr, contentsaveRes) {
            // Handle content save error
            if (contentsaveErr) {
              return done(contentsaveErr);
            }

            // Delete an existing content
            agent.delete('/api/contents/' + contentsaveRes.body._id)
              .send(content)
              .expect(200)
              .end(function (contentDeleteErr, contentDeleteRes) {
                // Handle content error error
                if (contentDeleteErr) {
                  return done(contentDeleteErr);
                }

                // Set assertions
                (contentDeleteRes.body._id).should.equal(contentsaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an content if not signed in', function (done) {
    // Set content user
    content.user = user;

    // Create new content model instance
    var contentObj = new Content(content);

    // Save the content
    contentObj.save(function () {
      // Try deleting content
      request(app).delete('/api/contents/' + contentObj._id)
        .expect(403)
        .end(function (contentDeleteErr, contentDeleteRes) {
          // Set message assertion
          (contentDeleteRes.body.message).should.match('User is not authorized');

          // Handle content error error
          done(contentDeleteErr);
        });

    });
  });

  it('should be able to get a single content that has an orphaned user reference', function (done) {
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

          // Save a new content
          agent.post('/api/contents')
            .send(content)
            .expect(200)
            .end(function (contentsaveErr, contentsaveRes) {
              // Handle content save error
              if (contentsaveErr) {
                return done(contentsaveErr);
              }

              // Set assertions on new content
              (contentsaveRes.body.title).should.equal(content.title);
              should.exist(contentsaveRes.body.user);
              should.equal(contentsaveRes.body.user._id, orphanId);

              // force the content to have an orphaned user reference
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

                    // Get the content
                    agent.get('/api/contents/' + contentsaveRes.body._id)
                      .expect(200)
                      .end(function (contentInfoErr, contentInfoRes) {
                        // Handle content error
                        if (contentInfoErr) {
                          return done(contentInfoErr);
                        }

                        // Set assertions
                        (contentInfoRes.body._id).should.equal(contentsaveRes.body._id);
                        (contentInfoRes.body.title).should.equal(content.title);
                        should.equal(contentInfoRes.body.user, undefined);

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
      Content.remove().exec(done);
    });
  });
});
