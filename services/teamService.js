const { User, Team, sequelize, Player } = require("../models");
const { errors } = require("../constants.json");

async function getAll() {
  let teams = await Team.findAll();
  return teams;
}

async function getById(id) {
  const team = await Team.findByPk(id);
  if (!team) throw errors.TEAM_NOT_FOUND;
  return team;
}

async function update(id, userId, params) {
  let team = await getById(id);
  if (team.userId !== userId) {
    throw errors.DENIED_TEAM_EDIT;
  }
  console.log(params)
  if (
    Object.keys(params).filter((key) => key !== "country" && key !== "name")
      .length > 0
  ) {
    throw errors.DENIED_TEAM_EDIT_REQ;
  }
  Object.assign(team, params);
  await team.save();
  return team.get();
}

module.exports = {
  getById,
  getAll,
  update,
};
