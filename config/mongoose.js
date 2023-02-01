const Mongoose = require('@ladjs/mongoose');
const mongoose = require('mongoose');

const logger = require('#helpers/logger');
const env = require('#config/env');

const m = new Mongoose({ logger });

// destroy initial connection
// <https://github.com/Automattic/mongoose/issues/12965>
const initialConnection = mongoose.connections.find((conn) => conn.id === 0);
if (initialConnection) initialConnection.destroy();

// <https://github.com/Automattic/mongoose/issues/12970>
for (const uri of [env.MONGO_URI, env.LOGS_MONGO_URI]) {
  if (mongoose.connections.some((conn) => conn._connectionString === uri))
    continue;
  m.createConnection(uri);
}
