var express = require('express');
var router = express.Router();
var postboxController = require('../controllers/postboxController.js');

/*
 * GET
 */
router.get('/show', postboxController.list);
router.get('/addbox', postboxController.add)
/*
 * GET
 */
router.get('/:id', postboxController.show);

/*
 * POST
 */
router.post('/', postboxController.create);
router.post('/open', postboxController.open);

/*
 * PUT
 */
router.put('/:id', postboxController.update);

/*
 * DELETE
 */
router.delete('/:id', postboxController.remove);

module.exports = router;
