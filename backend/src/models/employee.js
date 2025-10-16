import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Employee = sequelize.define("Employee", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true
    }
  }
});
