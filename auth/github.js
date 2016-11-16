const jwt = require('jsonwebtoken');
const passport = require('passport');
const express = require('express');

const GitHubStrategy = require('passport-github2').Strategy;
const router = express.Router();

const {users} = require('../db');
const {createUser} = require('./user');

require('dotenv').load();

const authConfig = require('./auth.json');

authConfig.clients.forEach(client => {
  passport.use(client.name, new GitHubStrategy(getGithubConfig(client.name), loginGithubUser));

  router.get(`/${client.name}/github`,
    passport.authenticate(client.name, {
      scope: ['user:email', 'read:org']
    }));

  router.get(`/${client.name}/github/callback`, getCallback(client.name, client.callback));
});

function getCallback(name, clientURL) {
  return (req, res, next) => {
    passport.authenticate(name, (err, user) => {
      if (err) {
        return res.redirect(`${clientURL}error/${err}`);
      }

      jwt.sign(user, process.env.TOKEN_SECRET, {},
        (err, token) => {
          console.log(err, token);
          if (err) return next(err);
          res.cookie('api-keyper-token', token);
          res.redirect(clientURL);
        });
    })(req, res, next);
  };
}

function getGithubConfig(client) {
  return {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.HOST}/auth/${client}/github/callback`
  };
}

function loginGithubUser(accessToken, refereshToken, profile, done) {
  users
    .findOne({
      github_id: profile.id
    }).then(user => {
      if (!user) {
        createUser(accessToken, profile)
          .then(user => {
            if (!user) return done('User not found. You must be a member of the gSchool github organization.');
            return done(null, user);
          }).catch(err => {
            return done(err);
          });
      } else {
        return done(null, user);
      }
    }).catch(err => {
      return done(err);
    });
}

module.exports = router;
