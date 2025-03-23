import dotenv from "dotenv";
const env = (process.env.NODE_ENV || "").trim(); // 'local', 'dev', 'prod'
dotenv.config();

const app = {
  port: parseInt(process.env.PORT ?? "5000"),
};

const local = {
  app: app,
  /* db: {
    user: process.env.LOCAL_PG_USER,
    password: process.env.LOCAL_PG_PASSWORD,
    host: process.env.LOCAL_PG_HOST,
    port: parseInt(process.env.LOCAL_PG_PORT),
    name: process.env.LOCAL_PG_DATABASE,
  }, */
};
const dev = {
  app: app,
  /* db: {
    user: process.env.DEV_PG_USER,
    password: process.env.DEV_PG_PASSWORD,
    host: process.env.DEV_PG_HOST,
    port: parseInt(process.env.DEV_PG_PORT),
    name: process.env.DEV_PG_DATABASE,
  }, */
};
const prod = {
  app: app,
  /* db: {
    // WARNING: DO NOT MAINTAIN PRODUCTION DATABASE INFORMATION HERE
    host: process.env.PROD_DB_HOST,
    //port: parseInt(process.env.PROD_DB_PORT),
    name: process.env.PROD_DB_NAME,
  }, */
};

const config: { [key: string]: any } = {
  local,
  dev,
  prod,
};

export default config[env || "local" || "dev" || "prod"];
