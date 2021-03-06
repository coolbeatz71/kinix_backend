/* eslint-disable no-console */
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
    logging: ['DEV', 'TEST'].includes(env) ? console.log : false,
    ...options,
  };
};

export const test = getOptions('TEST');
export const production = getOptions('PROD');
export const development = getOptions('DEV');
