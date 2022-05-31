var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

var multer = require('multer');
var upload = multer({dest: 'public/images/'});

/*
 * GET
 */
router.get('/', userController.list);
router.get('/login', userController.showLogin);
router.get('/register', userController.showRegister);
router.get('/logout', userController.logout);
router.get('/profile', userController.showProfile);
router.get('/support', userController.showSupport);
router.get('/mobileRegisterFace', userController.mobileRegisterFace);
router.get('/mobileLoginFace', userController.mobileLoginFace);

/*
 * POST
 */
router.post('/', userController.create);
router.post('/login', userController.login);
router.post('/mobileLogin', userController.mobileLogin);
router.post('/mobileRegisterFace', upload.array('registerImgs',10), userController.mobileRegisterFace);
router.post('/mobileLoginFace', upload.single('loginImg'), userController.mobileLoginFace);
router.post('/support', userController.sendEmail);

/*
 * PUT
 */
router.put('/:id', userController.update);

/*
 * DELETE
 */
router.delete('/:id', userController.remove);

module.exports = router;
