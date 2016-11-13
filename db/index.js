require('dotenv').load();

const db = require('monk')(process.env.MONGO_URI);
const clients = db.get('clients');
const instances = db.get('instances');

module.exports = {clients, instances};
