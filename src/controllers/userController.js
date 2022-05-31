/* eslint-disable class-methods-use-this */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User } = require('../models');
const ApiError = require('../error/ApiError');

const generateAccessToken = (id, email, role) => {
  const payload = {
    id,
    email,
    role,
  };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1y' });
};

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password, role } = req.body;
      if (!email || !password) {
        return next(ApiError.badRequest('Неккоректный email или password'));
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const candidate = await User.findOne({ where: { email } });
      if (candidate) {
        return next(
          ApiError.badRequest('Пользователь с таким email уже существует')
        );
      }

      const hashPassword = bcrypt.hashSync(password, 7);
      const user = await User.create({ email, role, password: hashPassword });
      const token = generateAccessToken(user.id, user.email, user.role);

      return res.json({ token });
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next(ApiError.internal('Пользователь не найден'));
      }

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return next(ApiError.internal('Указан неверный пароль'));
      }

      const token = generateAccessToken(user.id, user.email, user.role);
      return res.json({ token, user });
    } catch (err) {
      console.log(err);
      return res.status(400).send(err);
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.findAll();
      return res.json(users);
    } catch (err) {
      console.log(err);
      return res.status(400).send(err);
    }
  }

  async check(req, res) {
    const token = generateAccessToken(
      req.user.id,
      req.user.email,
      req.user.role
    );
    return res.json({ token });
  }
}

module.exports = new UserController();
