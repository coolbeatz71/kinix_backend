import fs from 'fs';
import { config } from 'dotenv';
import { Options } from 'sequelize';

config();

const getOptions = (env: string, options?: Partial<Options>): Options => {
  return {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env[`PGDATABASE_${env}`],
    host: process.env.PGHOST,
    dialect: 'postgres',
    // eslint-disable-next-line no-console
    logging: ['DEV', 'TEST'].includes(env) ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
        ca: fs.readFileSync(`${__dirname}/../../us-east-1-bundle.pem`),
      },
    },
    ...options,
  };
};

export const test = getOptions('TEST');
export const production = getOptions('PROD');
export const development = getOptions('DEV');
