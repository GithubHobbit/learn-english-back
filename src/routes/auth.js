const Router = require('express');

const router = new Router();
const { check } = require('express-validator');
const { UserController } = require('../controllers');
// const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post(
  '/registration',
  [
    check('email', 'Почта не может быть пустой').notEmpty(),
    check(
      'password',
      'Пароль должен быть больше 4 и меньше 18 символов',
    ).isLength({ min: 3, max: 17 }),
  ],
  UserController.registration,
);
router.post('/login', UserController.login);
router.get(
  '/users',
  checkRole('ADMIN'),
  // authMiddleware,
  UserController.getUsers,
);

module.exports = router;
