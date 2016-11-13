const express = require('express');
const router = express.Router();
const url = require('url');

require('dotenv').load();

const {clients, instances} = require('../db');

router.get('/', (req, res, next) => {
  clients
    .find({})
    .then(clients => {
      res.json(clients);
    });
})

router.post('/:id', (req, res, next) => {
  const client_id = req.params.id;
  const {client_secret} = req.body;

  if(client_secret)  {
    clients
      .findOne({
        client_id,
        client_secret
      }).then(client => {
        if(client) {
          return instances
              .find({
                client_id,
                active: true
              }).then(activeInstances => {
              res.json(activeInstances);
            });
        } else {
          return next('Keyper Error: Invalid client');
        }
      });
  } else {
    next('Keyper Error: Missing client_secret');
  }
});

router.post('/', (req, res, next) => {
  if(validClient(req.body)) {
    if(!validOrigins(req.body.origins)) {
      return next('Keyper Error: Origins must be valid URLs');
    }

    Promise.all([
      generateRandomToken(),
      generateRandomToken()
    ]).then(tokens => {
      const client = {
        client_id: tokens[0],
        client_secret: tokens[1],
        origins: req.body.origins,
        banned: [],
        host: req.body.host,
        query: req.body.query,
        headers: req.body.headers
      };

      clients
        .insert(client)
        .then(result => {
          res.json(result);
        });
    });
  } else {
    next('Keyper Error: Invalid client info. Must have origins, a host and either query or headers.');
  }
});

router.delete('/:id', (req, res, next) => {
  const client_id = req.params.id;
  const {client_secret} = req.body;

  if(client_secret)  {
    clients
      .findOne({
        client_id,
        client_secret
      }).then(client => {
        if(client) {
          return clients
            .remove({
              client_id
            }).then(() => {
              return instances.remove({
                client_id
              });
            }).then(() => {
              res.json({
                message: 'Client deleted'
              });
            });
        } else {
          return next('Keyper Error: Invalid client');
        }
      });
  } else {
    next('Keyper Error: Missing client_secret');
  }
});

router.post('/:id/ban', (req, res, next) => {
  const {id: client_id } = req.params;
  const {client_secret, ips} = req.body;

  if(client_secret)  {
    clients
      .findOne({
        client_id,
        client_secret
      }).then(client => {
        if(client) {
          if(client.banned) ips.concat(client.banned);
          clients.findOneAndUpdate({
            client_id
          }, {
            $set: {
              banned: ips
            }
          }).then(() => {
            return instances
              .remove({
                client_id,
                ip: {
                  $in: ips
                }
              }).then(() => {
                res.json({
                  message: 'IP(s) banned'
                });
              });
          });
        } else {
          return next('Keyper Error: Invalid client');
        }
      });
  } else {
    next('Keyper Error: Missing client_secret');
  }
});

router.delete('/:id/instance/:instance_id', (req, res, next) => {
  const {id: client_id, instance_id } = req.params;
  const {client_secret} = req.body;

  if(client_secret)  {
    clients
      .findOne({
        client_id,
        client_secret
      }).then(client => {
        if(client) {
          return instances.remove({
                _id: instance_id,
                client_id
              }).then(() => {
                res.json({
                  message: 'Instance removed.'
                });
              });
        } else {
          return next('Keyper Error: Invalid client');
        }
      });
  } else {
    next('Keyper Error: Missing client_secret');
  }
});

function validClient(client) {
  return typeof client.host == 'string' &&
    client.host.trim() != '' &&
    typeof client.origins == 'object' &&
    client.origins.constructor == Array &&
    (typeof client.query == 'object' || typeof client.headers == 'object');
}

function validOrigins(origins) {
  return origins.length > 0 && origins.filter(origin => {
    const parsed = url.parse(origin);
    return parsed.protocol != null || parsed.host != null;
  }).length == origins.length;
}

const crypto = require('crypto');
const {randomBytes} = require('crypto');

function generateRandomToken() {
  return new Promise((resolve) => {
    randomBytes(256, (error, buffer) => {
      resolve(crypto
        .createHash('sha1')
        .update(buffer)
        .digest('hex'));
    });
  });
}

module.exports = router;
