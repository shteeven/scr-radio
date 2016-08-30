'use strict';

module.exports = {
  app: {
    title: 'Seoul Community Radio',
    description: 'Channeling the spirit of pirate radio and the fresh vibe of Korea’s creative underground, Seoul Community Radio is a next-level platform for a world city about to blow.',
    keywords: 'mongodb, express, angularjs, node.js, mongoose, passport, Steven Barnhurst, Richard Price, Seoul, Itaewon, dj, djs, music, radio, online, shows, tracks, independent, watch',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID',
    logo: 'modules/core/client/img/brand/brand-logo.jpg'
  },
  port: process.env.PORT || 3000,
  templateEngine: 'swig',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'MEAN',
  // sessionKey is set to the generic sessionId key used by PHP applications
  // for obsecurity reasons
  sessionKey: 'sessionId',
  youtubeStreamID: process.env.YOUTUBE_STREAM_ID || '9IYhh-gfpVg',
  sessionCollection: 'sessions',
  logo: 'modules/core/client/img/brand/logo.png',
  favicon: 'modules/core/client/img/favicon.ico',
  uploads: {
    profileUpload: {
      dest: './modules/users/client/img/profile/uploads/', // Profile upload destination path
      limits: {
        fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
      }
    }
  }
};
