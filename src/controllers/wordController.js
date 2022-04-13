/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
// const jwt = require('jsonwebtoken');
const jwt = require('jsonwebtoken');

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
      console.log(words);
      return res.status(200).send(words);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  async create(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Пользователь не авторизован' });
      }

      const decodedData = jwt.verify(token, process.env.SECRET_KEY);
      const { firstLang, secondLang } = req.body;
      let pictureURL = null;
      const userId = decodedData.id;

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
        pictureURL = uploadResult.secure_url;

        unlink(path, (err) => {
          console.log(err);
          console.log('HI');
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
      //       const word = word.find(word => word.id === id);
      console.log('BODY');
      console.log(body);
      const item = await User.findByIdAndUpdate(id, body, { new: true });
      console.log('UPDATED_ITEM');
      console.log(item);
      return res.status(200).send(item);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  async delete({ params: { id } }, res) {
    try {
      await User.findByIdAndDelete(id);
      return res.status(200).send({ status: 'OK', message: 'Рецепт удален' });
    } catch (err) {
      return res.status(400).send(err);
    }
  }
}

module.exports = new WordController();
