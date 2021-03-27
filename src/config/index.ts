import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
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
    logging: false,
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

export default dbConfig;
