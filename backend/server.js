const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const { connect: connectRabbit } = require('./config/rabbitmq');
const socketHandler = require('./socket/handler');
const routes = require('./routes');
const { consume } = require('./services/notificationService');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/', routes);

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  await connectRabbit();
  socketHandler(server);
  await consume();

  server.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
})();
