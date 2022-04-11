/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
const { unlink } = require('fs');
const jwt = require('jsonwebtoken');
const bson = require('bson');

const cloudinary = require('../../utils/cloudinary');

const { User, UserDictionary } = require('../models');

function getUser(req, res) {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Пользователь не авторизован' });
  }
  return jwt.verify(token, process.env.SECRET);
}

const dictionaryController = {
  async get({ params: { id } }, res) {
    try {
      // ?????????????????????????????????
      const item = await User.findById(id);
      return res.status(200).send(item);
    } catch (err) {
      return res.status(400).send(err);
    }
  },
  async getAll(req, res) {
    try {
      const { id: userId } = getUser(req, res);
      const user = await User.findById(userId);
      const dictionary = await UserDictionary.findOne({
        _id: user.dictionaryId,
      });
      return res.status(200).send(dictionary.words);

      // cloudinary.v2.uploader.upload(
      //   'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg',
      //   { public_id: 'myfolder/olympic_flag' },
      //   (error, result) => { console.log(result); },
      // );

      // for (const item of items) {
      //   console.log('hi : ');
      //   console.log(item);
      //   Recipe.findById(item._id).populate('category').exec((err, itm) => {
      //     console.log('The author is %s', itm.category.title);
      //   });
      // }
      // console.log(items)
      // console.log("КАТЕГОРИИ");
      // const categories = await Category.find();

      // console.log(categories);
    } catch (err) {
      return res.status(400).send(err);
    }
  },
  async create(req, res) {
    try {
      const { id: userId } = getUser(req);
      const user = await User.findById(userId);

      const { body } = req;
      body._id = new bson.ObjectId();

      if (!req.files) {
        return res.status(500).send({ msg: 'file is not found' });
      }

      const path = `${__dirname}/../../public/${body._id}`;
      const name = body._id;

      const myFile = req.files.image;
      myFile.mv(path, (err) => {
        console.log(err);
      });
      const uploadResult = await cloudinary.uploader.upload(
        path,
        { public_id: `dictionaries/user_${user.id}/${name}` },
        (error, result) => {
          console.log(result, error);
        },
      );

      unlink(path, (err) => {
        console.log(err);
      });

      body.picture = uploadResult.secure_url;
      const result = await UserDictionary.updateOne(
        { _id: user.dictionaryId },
        { $push: { words: body } },
      );

      return res.status(200).send(result);
    } catch (err) {
      return res.status(400).send(err);
    }
  },
  async update({ params: { id }, body }, res) {
    try {
      //       const word = dictionary.find(word => word.id === id);
      console.log('BODY');
      console.log(body);
      const item = await User.findByIdAndUpdate(id, body, { new: true });
      console.log('UPDATED_ITEM');
      console.log(item);
      return res.status(200).send(item);
    } catch (err) {
      return res.status(400).send(err);
    }
  },
  async delete({ params: { id } }, res) {
    try {
      await User.findByIdAndDelete(id);
      return res.status(200).send({ status: 'OK', message: 'Рецепт удален' });
    } catch (err) {
      return res.status(400).send(err);
    }
  },
};

module.exports = {
  ...dictionaryController,
};
