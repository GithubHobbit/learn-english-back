const {
  model,
  Schema,
  Schema: {
    Types: { ObjectId },
  },
} = require('mongoose');

const User = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dictionaryId: {
    type: ObjectId,
    ref: 'UserWords',
  },
  roles: [
    {
      type: String,
      ref: 'Role',
    },
  ],
});

module.exports = model('users', User);
