const Router = require('express');

const router = new Router();
const { WordController } = require('../../controllers');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/:id', authMiddleware, WordController.get);
router.post('/', authMiddleware, WordController.create);
router.get('/', authMiddleware, WordController.getAll);
router.put('/', authMiddleware, WordController.update);
router.delete('/:id', authMiddleware, WordController.delete);

module.exports = router;
