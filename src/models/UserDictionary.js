const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  words: [
    {
      firstLang: {
        type: String,
        required: [true, 'Пусто'],
      },
      secondLang: {
        type: String,
        required: [true, 'Пусто'],
      },
      picture: {
        type: String,
      },
    },
  ],
});

// WITHOUT ID
// const schema = new mongoose.Schema({
//   words: [new mongoose.Schema({
//     firstLang: {
//       type: String,
//       required: [true, 'Пусто'],
//     },
//     secondLang: {
//       type: String,
//       required: [true, 'Пусто'],
//     },
//     picture: {
//       type: String,
//     },
//   }, { _id: false })],
// });

module.exports = mongoose.model('user_dictionaries', schema);
