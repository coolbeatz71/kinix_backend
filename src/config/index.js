const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE_DEV,
    host: process.env.PGHOST,
    dialect: 'postgres',
    logging: false,
  },
  test: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE_TEST,
    host: process.env.PGHOST,
    dialect: 'postgres',
    logging: true,
  },
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE_PROD,
    host: process.env.PGHOST,
    dialect: 'postgres',
    logging: false,
  },
};
