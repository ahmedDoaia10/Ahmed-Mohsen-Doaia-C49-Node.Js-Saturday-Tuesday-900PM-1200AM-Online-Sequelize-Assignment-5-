import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(`.env.${process.env.NODE_ENV}`) });

export const PORT = Number(process.env.PORT);

export const db = {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_HOST: process.env.DB_HOST,
  DB_DIALECT: process.env.DB_DIALECT,
  DB_MAX: Number(process.env.DB_MAX),
  DB_MIN: Number(process.env.DB_MIN),
};
