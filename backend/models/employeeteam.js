'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmployeeTeam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Employee, { foreignKey: 'employeeId' });
      this.belongsTo(models.Team, { foreignKey: 'teamId' });
    }
  }
  EmployeeTeam.init({
    employeeId: DataTypes.INTEGER,
    teamId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'EmployeeTeam',
  });
  return EmployeeTeam;
};