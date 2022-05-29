const sequelize = require('./db');
const { User, Word, ExampleSentences } = require('./models');

module.exports = {
  sequelize,
  User,
  Word,
  ExampleSentences,
};
