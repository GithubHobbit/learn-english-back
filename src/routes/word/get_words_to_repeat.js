const Router = require('express');

const router = new Router();
const { WordController } = require('../../controllers');
const authMiddleware = require('../../middleware/authMiddleware');

router.post('/', authMiddleware, WordController.getWordsToRepeat);

module.exports = router;
