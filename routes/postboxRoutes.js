var express = require('express');
var router = express.Router();
var postboxController = require('../controllers/postboxController.js');

/*
 * GET
 */
router.get('/show', postboxController.list);
router.get('/addbox', postboxController.add);
router.get('/remove/:id', postboxController.remove);
router.get('/edit/:id', postboxController.edit);
/*
 * GET
 */
router.get('/:id', postboxController.show);

/*
 * POST
 */
router.post('/mobileList', postboxController.mobileList);
router.post('/', postboxController.create);
router.post('/mobileOpen', postboxController.open);
router.post('/update/:id', postboxController.update);

module.exports = router;
