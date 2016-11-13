const express = require('express');
const router = express.Router();

const token = require('./token');
const request = require('./request');
const client = require('./client');

router.use('/token', token);
router.use('/request', request);
router.use('/client', client);

module.exports = router;
