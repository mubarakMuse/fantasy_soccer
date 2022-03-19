"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.userId = this.belongsTo(models.User, {
        foreignKey: "userId",
        field: "user_id",
      });
    }
  }
  Team.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      budget: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updated_at",
      },
    },
    {
      sequelize,
      modelName: "Team",
      tableName: "team",
      freezeTableName: true,
    }
  );
  return Team;
};
