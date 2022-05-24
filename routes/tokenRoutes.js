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
router.get('/remove/:id', tokenController.removeOther);
router.get('/edit/:id', tokenController.edit);

/*
 * POST
 */
router.post('/', tokenController.create);
router.post('/update/:id', tokenController.update);

module.exports = router;
