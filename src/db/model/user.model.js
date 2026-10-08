import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";

function checkNameLength(user) {
  if (user.name.length <= 2) {
    throw new Error("Name must be longer than 2 characters", {
      cause: 400,
    });
  }
}



export const userModel = sequelize.define(
  "user",
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        checkPasswordLength(value) {
          if (value.length <= 6) {
            throw new Error("Password must be longer than 6 characters");
          }
        },
      },
    },

    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    tableName: "users",

    hooks: {
      beforeCreate: checkNameLength,
    },
  },
);
