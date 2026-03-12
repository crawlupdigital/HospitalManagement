require('dotenv').config();
const http = require('http');
const app = require('./app');
const sequelize = require('./config/db');
const { initSocket } = require('./config/socket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

async function startServer() {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Start listening
    server.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
