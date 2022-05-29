const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

const Word = sequelize.define('word', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstLang: { type: DataTypes.TEXT },
  secondLang: { type: DataTypes.TEXT },
  example: { type: DataTypes.TEXT },
  translateExample: { type: DataTypes.TEXT },
  lastRepetition: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
  numberRepetition: { type: DataTypes.INTEGER, defaultValue: 0 },
  numberErrors: { type: DataTypes.INTEGER, defaultValue: 0 },
  picture: { type: DataTypes.TEXT },
});

const ExampleSentences = sequelize.define('example_sentences', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  term: { type: DataTypes.TEXT },
  example: { type: DataTypes.TEXT },
  translateExample: { type: DataTypes.TEXT },
});

User.hasMany(Word);
Word.belongsTo(User);

module.exports = {
  User,
  Word,
  ExampleSentences,
};
