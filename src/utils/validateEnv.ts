import { cleanEnv, port, str } from 'envalid';

const options = {
  NODE_ENV: str(),
  PGUSER: str(),
  PGPASSWORD: str(),
  PGHOST: str(),
  PGDATABASE_DEV: str(),
  PGDATABASE_TEST: str(),
  PGDATABASE_PROD: str(),
  JWT_SECRET: str(),
  PORT: port(),
};

const validateEnv = () => {
  cleanEnv(process.env, options);
};

export default validateEnv;
