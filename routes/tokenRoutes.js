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
router.get('/remove/:id/tmp/:postboxId', tokenController.remove);

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

module.exports = router;
