const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const url = require('url');
const requestProxy = require('express-request-proxy');
const get_ip = require('ipware')().get_ip;

require('dotenv').load();

const {clients, instances, requestLogs} = require('../db');

router.use('/*', (req, res, next) => {
  const requestedWith = req.get('x-keyper-requested-with');
  if(!requestedWith) return next('Keyper error: Invalid request');

  const origin = req.get('x-keyper-origin');
  if(!origin) return next('Keyper error: Invalid origin');

  const ip = get_ip(req).clientIp;

  const token = req.get('x-keyper-token');
  jwt.verify(token, process.env.TOKEN_SECRET, (error, payload) => {
    if(error) return next(error);

    const {instance_ids} = payload;

    instances
      .find({ _id: { $in: instance_ids }, active: true })
      .then(activeInstances => {
        if(activeInstances.length > 0) {
          return clients
            .find({
              client_id: {
                $in: activeInstances.map(instance => instance.client_id)
              }
            }).then(validClients => {
              return {
                validClients,
                activeInstances
              };
            });
        } else {
          next('Keyper Error: No active instances found.');
        }
      }).then(clientsAndInstances => {
        const {
          validClients,
          activeInstances
        } = clientsAndInstances;

        if(validClients.length > 0) {
          const host = url.parse(req.originalUrl.split('api/v1/request/')[1]).host;
          const matchedClients = validClients.filter(client => client.host == host);
          if(matchedClients.length > 0) {
            const client = matchedClients[0];

            if(!client.origins.includes(origin)) return next('Keyper Error: Invalid origin');

            const instance = activeInstances.filter(instance => instance.client_id == client.client_id)[0];

            if(instance.ip != ip) return next('Keyper Error: IP mismatch');

            const options = {
               url: '*',
               headers: {}
            };

            if(client.query) {
              options.query = client.query;
            }

            if(client.headers) {
              options.headers = client.headers;
            }

            options.headers['x-keyper-origin'] = '.';
            options.headers['x-keyper-requested-with'] = '.';
            options.headers['x-keyper-token'] = '.';

            instances.findOneAndUpdate({_id: instance._id}, {$inc: {request_count: 1}});

            const urlParts = req.originalUrl.split('/api/v1/request/');
            const requestURL = urlParts.length > 0 ? urlParts[1] : '';

            console.log('requestURL', requestURL);
            requestLogs
              .insert({
                datetime: new Date(),
                client_id: instance.client_id,
                instance_id: instance._id,
                url: requestURL
              });

            requestProxy(options)(req, res, next);
          } else {
            next(`Keyper Error: No client found that matches the given host: ${host}`);
          }
        } else {
          next('Keyper Error: Invalid client_id(s).');
        }
      });
  });
});

module.exports = router;
