const { Team, sequelize, Player, Transfer } = require("../models");
const playerService = require("./playerService");
const { getRandomPlayerValue } = require("../util");
const { errors } = require("../constants.json");

async function getAll() {
  let transfers = await Transfer.findAll();
  return transfers;
}
async function getActiveTransfers() {
  let activeTransfers = await Transfer.findAll({
    where: {
      status: "active",
    },
  });
  return activeTransfers;
}

async function sell(id, sellerId, { askPrice }) {
  let player = await playerService.getById(id);

  if (player.userId !== sellerId) {
    throw errors.DENIED_PLAYER_SELL;
  }
  let activePlayerTransfer = await Transfer.findOne({
    where: {
      player_id: player.id,
      status: "active",
    },
  });
  if (activePlayerTransfer) throw errors.PLAYER_ACTIVE_ON_TRANSFER;
  let newTransfer = Transfer.create({
    askPrice,
    sellerId: player.userId,
    status: "active",
    playerId: id,
  });
  return newTransfer;
}

async function buy(id, buyerId) {
  let transfer = await Transfer.findOne({
    where: {
      player_id: id,
      status: "active",
    },
  });

  if (!transfer) throw errors.PLAYER_INACTIVE_ON_TRANSFER;
  let  activeTransfer = transfer.get()


  if (activeTransfer.sellerId === buyerId) {
    throw errors.DENIED_PLAYER_BUY;
  }


  let player = await Player.findOne({ where: { id: activeTransfer.playerId } });
  let buyerTeam = await Team.findOne({ where: { user_id: buyerId } });
  if (buyerTeam.get().budget < activeTransfer.askPrice) throw errors.INSUFFICIENT_FUNDS;

  let sellerTeam = await Team.findOne({
    where: { user_id: activeTransfer.sellerId },
  });

  let newPlayerValue = player.get().marketValue * getRandomPlayerValue();
  let askPrice = activeTransfer.askPrice * 1;

  return sequelize.transaction(function (t) {
    return Team.update(
      {
        budget: buyerTeam.get().budget - askPrice,
        value: buyerTeam.get().value + newPlayerValue,
      },
      { where: { id: buyerTeam.get().id } },
      { transaction: t }
    ).then(() => {
      return Team.update(
        {
          budget: sellerTeam.get().budget + askPrice,
          value: sellerTeam.get().value - player.get().marketValue,
        },
        { where: { id: sellerTeam.get().id } },
        { transaction: t }
      ).then(() => {
        return Player.update(
          {
            marketValue: newPlayerValue,
            userId: buyerTeam.get().userId,
            teamId: buyerTeam.get().id,
          },
          { where: { id: activeTransfer.playerId } },
          { transaction: t }
        ).then(() => {
          return Transfer.update(
            { status: "complete", buyerId: buyerId },
            { where: { id: activeTransfer.id } },
            { transaction: t }
          );
        });
      });
    });
  });
}

module.exports = {
  getActiveTransfers,
  getAll,
  sell,
  buy,
};
