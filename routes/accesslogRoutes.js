var express = require('express');
var router = express.Router();
var accesslogController = require('../controllers/accesslogController.js');

/*
 * GET
 */
router.get('/:id', accesslogController.list);

/*
 * POST
 */
router.post('/', accesslogController.create);
router.post('/mobile', accesslogController.mobileLogList)

/*
 * DELETE
 */
router.delete('/:id', accesslogController.remove);

module.exports = router;
