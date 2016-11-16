require('dotenv').load();

const db = require('monk')(process.env.MONGO_URI);
const users = db.get('users');
const clients = db.get('clients');
const instances = db.get('instances');
const requestLogs = db.get('requestLogs');

module.exports = {users, clients, instances, requestLogs};
