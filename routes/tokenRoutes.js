var express = require('express');
var router = express.Router();
var tokenController = require('../controllers/tokenController.js');

/*
 * GET
 */
router.get('/:id', tokenController.list);

/*
 * GET
 */
router.get('/:id', tokenController.show);
router.get('/add/:id', tokenController.showAddToken);

/*
 * POST
 */
router.post('/', tokenController.create);

/*
 * PUT
 */
router.put('/:id', tokenController.update);

/*
 * DELETE
 */
router.delete('/:id', tokenController.remove);

module.exports = router;
