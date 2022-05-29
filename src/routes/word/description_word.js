const Router = require('express');

const router = new Router();
const { WordController } = require('../../controllers');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/:word', authMiddleware, WordController.getExamples);


module.exports = router;
