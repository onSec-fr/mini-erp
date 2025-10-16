import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Employee } from "./employee.js";
import { Project } from "./project.js";

export const Assignment = sequelize.define("Assignment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role: {
    type: DataTypes.STRING
  },
  hours: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

// relations
Employee.belongsToMany(Project, { through: Assignment });
Project.belongsToMany(Employee, { through: Assignment });
// so you can include Employee/Project from Assignment (ex: Assignment.findAll({ include: [Employee, Project] }))
// need to set belongsTo on join model too
Assignment.belongsTo(Employee, { foreignKey: 'EmployeeId' });
Assignment.belongsTo(Project, { foreignKey: 'ProjectId' });
