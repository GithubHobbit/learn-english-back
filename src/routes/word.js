const Router = require('express');

const router = new Router();
const { WordController } = require('../controllers');
// const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id', WordController.get);
router.post('/', WordController.create);
router.get('/', WordController.getAll);
router.put('/:id', WordController.update);
router.delete('/:id', WordController.delete);

module.exports = router;
