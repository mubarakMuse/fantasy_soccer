const { User, Team, sequelize, Player } = require("../models");
const config = require("../config/config.json");
const { errors } = require("../constants.json");
const jwt = require("jsonwebtoken");
const { createDefaultTeam, createDefaultPlayers, removeHashedPassowrd } = require("../util");
const bcrypt = require("bcryptjs");

async function signup({ firstName, lastName, email, password }) {
  let hashedPassword = await bcrypt.hash(password, 10);
  return sequelize.transaction(function (t) {
    return User.create(
      { firstName, lastName, email, hashedPassword },
      { transaction: t }
    ).then(function (user) {
      let defaultTeam = createDefaultTeam(user);
      return Team.create(defaultTeam, { transaction: t }).then(function (team) {
        return Player.bulkCreate(createDefaultPlayers(user, team), {
          transaction: t,
        }).then(function (players) {
          return { user: removeHashedPassowrd(user.get()), team, players };
        });
      });
    });
  });
}

async function login({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
    throw errors.INVALID_CREDENTIALS;
  }
  const token = jwt.sign({ sub: user.id }, process.env.secret, { expiresIn: "1d" });
  return { ...removeHashedPassowrd(user.get()), token };
}

async function getAll() {
  let users = await User.findAll();
  return users;
}

async function getById(id) {
  const user = await User.findByPk(id);
  if (!user) errors.USER_NOT_FOUND;
  return removeHashedPassowrd(user.get());
}

async function getPlayersByUserId(id) {
  const user = await getById(id);
  let players = Player.findAll({
    where: {
      user_id: user.id,
    },
  });
  return players;
}


module.exports = {
  signup,
  login,
  getById,
  getAll,
  getPlayersByUserId,
};
