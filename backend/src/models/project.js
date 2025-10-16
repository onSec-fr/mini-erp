import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Project = sequelize.define("Project", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  client: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  }
});
