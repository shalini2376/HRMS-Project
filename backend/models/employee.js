'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Organisation, { foreignKey: 'organisationId' });

      // Many-to-many: Employee ↔ Team through EmployeeTeam
      this.belongsToMany(models.Team, {
        through: models.EmployeeTeam,
        foreignKey: 'employeeId',
        otherKey: 'teamId'
      });
    }
  }
  Employee.init({
    organisationId: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};