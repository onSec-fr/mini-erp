import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Customer = sequelize.define("Customer", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING
  }
});

