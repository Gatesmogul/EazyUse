import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "your_db",
  "your_user",
  "your_password",
  {
    host: "localhost",
    dialect: "postgres", // or mysql
    logging: false,
  }
);