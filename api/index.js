const express = require('express');
const router = express.Router();

const auth = require('../auth');
const token = require('./token');
const request = require('./request');
const client = require('./client');

router.use('/token', token);
router.use('/request', request);
router.use('/client', auth.loggedIn, client);

module.exports = router;
