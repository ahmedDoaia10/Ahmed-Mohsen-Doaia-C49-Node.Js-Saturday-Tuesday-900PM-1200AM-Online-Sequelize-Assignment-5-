import { Sequelize } from "sequelize";
import { db } from "../config/config.service.js";

export let sequelize = new Sequelize(db.DB_NAME, db.DB_USER, db.DB_PASS, {
  host: db.DB_HOST,
  dialect: db.DB_DIALECT,
  pool: {
    max: db.DB_MAX,
    min: db.DB_MIN,
  },
});



export const connect = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({
      alter: false,
    });
    console.log("Database Connected");
  } catch (error) {
    console.error("database failed", error);
  }
};
