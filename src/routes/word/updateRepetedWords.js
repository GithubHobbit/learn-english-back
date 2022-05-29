const Router = require('express');

const router = new Router();
const { WordController } = require('../../controllers');
const authMiddleware = require('../../middleware/authMiddleware');

router.put('/', authMiddleware, WordController.updateRepetedWords);

module.exports = router;
