require('dotenv').config();
const sequelize = require('../config/db');
const models = require('../models');

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Sync all models 
    // force: false, alter: true will modify tables to match models
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
    
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database or sync models:', error);
    process.exit(1);
  }
}

migrate();
