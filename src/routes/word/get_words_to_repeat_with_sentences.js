const Router = require('express');

const router = new Router();
const { WordController } = require('../../controllers');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/', authMiddleware, WordController.getWordsToRepeatWithSentences);

module.exports = router;
