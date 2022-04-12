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
  firstLang: { type: DataTypes.STRING },
  secondLang: { type: DataTypes.STRING },
  picture: { type: DataTypes.STRING },
});

User.hasMany(Word);
Word.belongsTo(User);

module.exports = {
  User,
  Word,
};
