const sequelize = require('./db');
const { User, Word } = require('./models');

module.exports = {
  sequelize,
  User,
  Word,
};
