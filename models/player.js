"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.teamId = this.belongsTo(models.Team, {
        foreignKey: "teamId",
        field: "team_id",
      });
      this.userId = this.belongsTo(models.User, {
        foreignKey: "userId",
        field: "user_id",
      });
    }
  }
  Player.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "first_name",
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "last_name",
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      marketValue: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "market_value",
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "team_id",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
    },
    {
      sequelize,
      modelName: "Player",
      tableName: "player",
      freezeTableName: true,
    }
  );
  return Player;
};
