const { User, Team, sequelize, Player } = require("../models");
const { errors } = require("../constants.json");

async function getAll() {
  let players = await Player.findAll();
  return players;
}

async function getById(id) {
  const player = await Player.findByPk(id);
  if (!player) throw errors.PLAYER_NOT_FOUND;
  return player;
}

async function update(id, userId, params) {
  player = await getById(id);
  if (player.userId !== userId) {
    throw errors.DENIED_PLAYER_EDIT;
  }
  if (
    Object.keys(params).filter(
      (key) => key !== "country" && key !== "firstName" && key !== "lastName"
    ).length > 0
  ) {
    throw errors.DENIED_PLAYER_EDIT_REQ;
  }
  Object.assign(player, params);
  await player.save();
  return player.get();
}

module.exports = {
  getById,
  getAll,
  update,
};
