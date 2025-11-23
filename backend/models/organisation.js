'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Organisation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // One organisation has many users, employees, teams, logs
      this.hasMany(models.User, { foreignKey: 'organisationId' });
      this.hasMany(models.Employee, { foreignKey: 'organisationId' });
      this.hasMany(models.Team, { foreignKey: 'organisationId' });
      this.hasMany(models.Log, { foreignKey: 'organisationId' });
    }
  }
  Organisation.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Organisation',
  });
  return Organisation;
};