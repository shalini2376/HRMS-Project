'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Organisation, { foreignKey: 'organisationId' });

      // Many-to-many: Team ↔ Employee
      this.belongsToMany(models.Employee, {
        through: models.EmployeeTeam,
        foreignKey: 'teamId',
        otherKey: 'employeeId'
      });
    }
  }
  Team.init({
    organisationId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Team',
  });
  return Team;
};