const session = require('express-session');
var UserModel = require('../models/userModel.js');
const spawn = require('child_process').spawn;
var path = require('path');
const fs =  require('fs');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    /**
     * userController.create()
     */
    create: function (req, res) {
        if(req.body.password == req.body.repeatpassword) {
            var user = new UserModel({
                username : req.body.username,
                email : req.body.email,
                password : req.body.password
            });

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating user',
                        error: err
                    });
                }
                return res.render('user/login', { success: "Registration successful! Please log in." });
            });
        }
        else {
            var fail="Passwords did not match!";
            return res.render('user/register', { fail, inputs: req.body });
        }
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
			user.email = req.body.email ? req.body.email : user.email;
			user.password = req.body.password ? req.body.password : user.password;
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }
                return res.status(201).json(user)
                //return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    login: function(req, res, next){
        UserModel.authenticate(req.body.username, req.body.password, function(error, user){
           if(error || !user){
               return res.render('user/login', { warning: "Wrong username or password."})
           } else{
                req.session.userId = user._id;
                req.session.userName = user.username;
                return res.redirect('/');
           }
        });
    },

    mobileLogin: function(req, res){
        UserModel.authenticate(req.body.username, req.body.password, function(error, user){
            if(error || !user){
                return res.status(404).json({
                    message: 'Wrong username or password.'
                });
            } else{
                return res.json(user);
            }
         });
    },

    mobileLoginFace: function(req, res){
        var img = req.body.faceImage
        var scriptPath = path.resolve('./public/python/login.py');
        const pyLogin = spawn('python',[scriptPath,img]);
        pyLogin.stderr.pipe(process.stderr);
        pyLogin.stdout.on('data',function(data){
            return res.json(data.toString());
        });
    },

    mobileRegisterFace: function(req, res){
        console.log(req.body);
        for(i in req.file){
            console.log(i.filename);
        }
        var scriptPath = path.resolve('./public/python/register.py');
        const pyRegister = spawn('python',[scriptPath,req.session.userName]);
        pyRegister.stderr.pipe(process.stderr);
        pyRegister.stdout.on('data',function(data){
            return res.json(data.toString());
        });
    },

    logout: function (req,res,next){
        if(req.session){
            req.session.destroy(function(err){
                if(err){
                    return next(err);
                } else {
                    return res.redirect('/');
                }
            });
        }
    },

    sendEmail: function (req, res) {        //TODO
        return res.redirect('/');
    },

    showSupport: function (req, res) {
        console.log(req.session.userId);
        if(req.session){
            UserModel.findOne({_id: req.session.userId}, function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting user.',
                        error: err
                    });
                }
    
                if (!user) {
                    return res.status(404).json({
                        message: 'No such user'
                    });
                }
    
                res.render('user/support', user);
            });
        } else {
            res.render('user/support')
        }

    },

    showProfile: function (req, res) {
        res.render('user/profile');
    },

    showLogin: function (req, res) {
        res.render('user/login');
    },

    showRegister: function (req, res) {
        res.render('user/register');
    }
};
