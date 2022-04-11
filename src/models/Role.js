const { Schema, model } = require('mongoose');

const Role = new Schema({
  value: {
    type: String,
    unique: true,
    require: true,
  },
});

module.exports = model('roles', Role);
