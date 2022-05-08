var express = require('express');
var router = express.Router();
var accesslogController = require('../controllers/accesslogController.js');

/*
 * GET
 */
router.get('/', accesslogController.list);

/*
 * GET
 */
router.get('/:id', accesslogController.show);

/*
 * POST
 */
router.post('/', accesslogController.create);

/*
 * PUT
 */
router.put('/:id', accesslogController.update);

/*
 * DELETE
 */
router.delete('/:id', accesslogController.remove);

module.exports = router;
