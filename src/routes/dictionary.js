const Router = require('express');
const router = new Router();
const { dictionary } = require('../controllers');

router.get('/:word', dictionary.get);
router.post('/', dictionary.create);
router.get('/', dictionary.getAll);
router.put('/:id', dictionary.update);
router.delete('/:id', dictionary.delete);

module.exports = router;
