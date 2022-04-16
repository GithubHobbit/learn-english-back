/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
// const jwt = require('jsonwebtoken');
const { unlink } = require('fs');
const uuid = require('uuid');
const ApiError = require('../error/ApiError');
const cloudinary = require('../../utils/cloudinary');
const { User, Word } = require('../models');

// function getUser(req, res) {
//   const token = req.headers.authorization.split(' ')[1];
//   if (!token) {
//     return res.status(403).json({ message: 'Пользователь не авторизован' });
//   }
//   return jwt.verify(token, process.env.SECRET_KEY);
// }

class WordController {
  async get({ params: { id } }, res) {
    try {
      const words = await Word.findOne({ where: { id } });
      return res.status(200).send(words);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  async getAll(req, res) {
    try {
      const userId = req.user.id;
      const words = await Word.findAll({ where: { userId } });
      return res.status(200).send(words);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  async create(req, res, next) {
    try {
      const { firstLang, secondLang } = req.body;
      let pictureURL = null;
      const userId = req.user.id;

      if (req.files) {
        const { image } = req.files;
        const name = uuid.v4();
        const path = `${__dirname}/../../public/${name}`;

        image.mv(path);
        const uploadResult = await cloudinary.uploader.upload(
          path,
          { public_id: `dictionaries/user_${userId}/${name}` },
          (error, result) => {
            console.log(result, error);
          }
        );
        console.log(uploadResult);
        pictureURL = uploadResult.secure_url;
        unlink(path, (err) => {
          console.log(err);
        });
      }

      const word = await Word.create({
        firstLang,
        secondLang,
        userId,
        picture: pictureURL,
      });

      return res.status(200).send(word);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async update({ params: { id }, body }, res) {
    try {
      const item = await User.findByIdAndUpdate(id, body, { new: true });
      return res.status(200).send(item);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  async delete(req, res) {
    try {
      const wordId = req.params.id;
      const word = await Word.findOne({ where: { id: wordId } });

      const link = word.picture;
      const path = link.substring(
        link.indexOf('dictionaries'),
        link.lastIndexOf('.')
      );

      cloudinary.uploader.destroy(path, (result) => {
        console.log(result);
      });
      const result = await Word.destroy({ where: { id: wordId } });
      return res.status(200).send({ status: 'OK', message: 'Слово удалено' });
    } catch (err) {
      return res.status(400).send(err);
    }
  }
}

module.exports = new WordController();
