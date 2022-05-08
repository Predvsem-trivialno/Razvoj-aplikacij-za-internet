var express = require('express');
var router = express.Router();
var postboxController = require('../controllers/postboxController.js');

/*
 * GET
 */
router.get('/', postboxController.list);
router.get('/addbox', postboxController.add)
/*
 * GET
 */
router.get('/:id', postboxController.show);

/*
 * POST
 */
router.post('/', postboxController.create);

/*
 * PUT
 */
router.put('/:id', postboxController.update);

/*
 * DELETE
 */
router.delete('/:id', postboxController.remove);

module.exports = router;
