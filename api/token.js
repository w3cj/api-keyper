const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const get_ip = require('ipware')().get_ip;

require('dotenv').load();

const {clients, instances} = require('../db');

router.get('/check', (req, res, next) => {
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
              if(validClients.length != instance_ids.length) {
                next('Keyper status: ⁉️. Some invalid instances found.');
              } else {
                res.json({ message: 'Keyper status: ✅' });
              }
            });
        } else {
          next('Keyper status: 🚫. No active instances found.');
        }
      });
  });
});

router.post('/', (req, res, next) => {
  const user_agent = req.get('user-agent');
  if(!user_agent) {
    return next('Keyper Error: Missing required header.');
  }

  let hosts = req.body;
  const ip = get_ip(req).clientIp;

  const ids = Object.keys(hosts).map(key => {
    return hosts[key].client_id;
  });

  clients.find({
    client_id: { $in: ids }
  }).then(validClients => {
    if(validClients.length == 0) return next('Keyper Error: Invalid client_id(s).');

    const newInstances = validClients
      .filter(client => {
        return !client.banned.includes(ip);
      }).map(client => {
        return {
          ip,
          client_id: client.client_id,
          user_agent,
          active: true
        };
      });

    if(newInstances.length == 0) return next('Keyper Error: ⛔️');

    instances
      .insert(newInstances)
      .then(instances => {
        hosts = validClients.reduce((hosts, client) => {
          hosts[client.host] = {
            client_id: client.client_id
          };
          return hosts;
        }, {});
        jwt.sign({
          hosts,
          instance_ids: instances.map(instance => instance._id)
        }, process.env.TOKEN_SECRET, {}, (error, token) => {
          res.json({
            token
          });
        });
      });
  });
});

module.exports = router;
