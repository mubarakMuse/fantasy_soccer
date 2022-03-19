
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = sequelize;

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: 'mubarak-muse',
  username: 'mubarakmuse',
  password: null,
  host: 'localhost',
  define: {
    freezeTableName: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

module.exports = db;