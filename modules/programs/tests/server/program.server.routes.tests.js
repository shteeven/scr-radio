'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Program = mongoose.model('Program'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, program;

/**
 * Program routes tests
 */
describe('Program CRUD tests', function () {

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

    // Save a user to the test db and create new program
    user.save(function () {
      program = {
        title: 'Program Title',
        content: 'Program Content'
      };

      done();
    });
  });

  it('should be able to save an program if logged in', function (done) {
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

        // Save a new program
        agent.post('/api/programs')
          .send(program)
          .expect(200)
          .end(function (programsaveErr, programsaveRes) {
            // Handle program save error
            if (programsaveErr) {
              return done(programsaveErr);
            }

            // Get a list of programs
            agent.get('/api/programs')
              .end(function (programsGetErr, programsGetRes) {
                // Handle program save error
                if (programsGetErr) {
                  return done(programsGetErr);
                }

                // Get programs list
                var programs = programsGetRes.body;

                // Set assertions
                (programs[0].user._id).should.equal(userId);
                (programs[0].title).should.match('Program Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an program if not logged in', function (done) {
    agent.post('/api/programs')
      .send(program)
      .expect(403)
      .end(function (programsaveErr, programsaveRes) {
        // Call the assertion callback
        done(programsaveErr);
      });
  });

  it('should not be able to save an program if no title is provided', function (done) {
    // Invalidate title field
    program.title = '';

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

        // Save a new program
        agent.post('/api/programs')
          .send(program)
          .expect(400)
          .end(function (programsaveErr, programsaveRes) {
            // Set message assertion
            (programsaveRes.body.message).should.match('Title cannot be blank');

            // Handle program save error
            done(programsaveErr);
          });
      });
  });

  it('should be able to update an program if signed in', function (done) {
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

        // Save a new program
        agent.post('/api/programs')
          .send(program)
          .expect(200)
          .end(function (programsaveErr, programsaveRes) {
            // Handle program save error
            if (programsaveErr) {
              return done(programsaveErr);
            }

            // Update program title
            program.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing program
            agent.put('/api/programs/' + programsaveRes.body._id)
              .send(program)
              .expect(200)
              .end(function (programUpdateErr, programUpdateRes) {
                // Handle program update error
                if (programUpdateErr) {
                  return done(programUpdateErr);
                }

                // Set assertions
                (programUpdateRes.body._id).should.equal(programsaveRes.body._id);
                (programUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of programs if not signed in', function (done) {
    // Create new program model instance
    var programObj = new Program(program);

    // Save the program
    programObj.save(function () {
      // Request programs
      request(app).get('/api/programs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single program if not signed in', function (done) {
    // Create new program model instance
    var programObj = new Program(program);

    // Save the program
    programObj.save(function () {
      request(app).get('/api/programs/' + programObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', program.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single program with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/programs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Program is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single program which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent program
    request(app).get('/api/programs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No program with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an program if signed in', function (done) {
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

        // Save a new program
        agent.post('/api/programs')
          .send(program)
          .expect(200)
          .end(function (programsaveErr, programsaveRes) {
            // Handle program save error
            if (programsaveErr) {
              return done(programsaveErr);
            }

            // Delete an existing program
            agent.delete('/api/programs/' + programsaveRes.body._id)
              .send(program)
              .expect(200)
              .end(function (programDeleteErr, programDeleteRes) {
                // Handle program error error
                if (programDeleteErr) {
                  return done(programDeleteErr);
                }

                // Set assertions
                (programDeleteRes.body._id).should.equal(programsaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an program if not signed in', function (done) {
    // Set program user
    program.user = user;

    // Create new program model instance
    var programObj = new Program(program);

    // Save the program
    programObj.save(function () {
      // Try deleting program
      request(app).delete('/api/programs/' + programObj._id)
        .expect(403)
        .end(function (programDeleteErr, programDeleteRes) {
          // Set message assertion
          (programDeleteRes.body.message).should.match('User is not authorized');

          // Handle program error error
          done(programDeleteErr);
        });

    });
  });

  it('should be able to get a single program that has an orphaned user reference', function (done) {
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

          // Save a new program
          agent.post('/api/programs')
            .send(program)
            .expect(200)
            .end(function (programsaveErr, programsaveRes) {
              // Handle program save error
              if (programsaveErr) {
                return done(programsaveErr);
              }

              // Set assertions on new program
              (programsaveRes.body.title).should.equal(program.title);
              should.exist(programsaveRes.body.user);
              should.equal(programsaveRes.body.user._id, orphanId);

              // force the program to have an orphaned user reference
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

                    // Get the program
                    agent.get('/api/programs/' + programsaveRes.body._id)
                      .expect(200)
                      .end(function (programInfoErr, programInfoRes) {
                        // Handle program error
                        if (programInfoErr) {
                          return done(programInfoErr);
                        }

                        // Set assertions
                        (programInfoRes.body._id).should.equal(programsaveRes.body._id);
                        (programInfoRes.body.title).should.equal(program.title);
                        should.equal(programInfoRes.body.user, undefined);

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
      Program.remove().exec(done);
    });
  });
});
