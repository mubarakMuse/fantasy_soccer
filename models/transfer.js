"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transfer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.sellerId = this.belongsTo(models.Team, {
        foreignKey: "sellerId",
        field: "seller_id",
      });
      this.buyerId = this.belongsTo(models.User, {
        foreignKey: "buyerId",
        field: "buyer_id",
      });
      this.playerId = this.belongsTo(models.User, {
        foreignKey: "playerId",
        field: "player_id",
      });

    }
  }
  Transfer.init(
    {
        playerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "player_id",
      },
      askPrice: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "ask_price",
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
      sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "seller_id",
      },
      buyerId: {
        type: DataTypes.INTEGER,
        field: "buyer_id",
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Transfer",
      tableName: "transfer",
      freezeTableName: true,
    }
  );
  return Transfer;
};
