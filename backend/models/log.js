'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Organisation, { foreignKey: 'organisationId' });
      this.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Log.init({
    organisationId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    action: DataTypes.STRING,
    meta: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Log',
  });
  return Log;
};