var TokenModel = require('../models/tokenModel.js');
var UserModel = require('../models/userModel.js');

/**
 * tokenController.js
 *
 * @description :: Server-side logic for managing tokens.
 */
module.exports = {

    /**
     * tokenController.list()
     */
    list: function (req, res) {
        TokenModel.find({postboxId: req.params.id}).sort({dateExpiry: -1}).populate('userId').exec(function (err, tokens) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting tokens.',
                    error: err
                });
            }
            return res.render('token/showtokens', { tokens: tokens, boxId: req.params.id });
        });
    },

    /**
     * tokenController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        TokenModel.findOne({_id: id}, function (err, token) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting token.',
                    error: err
                });
            }

            if (!token) {
                return res.status(404).json({
                    message: 'No such token'
                });
            }

            return res.json(token);
        });
    },

    /**
     * tokenController.create()
     */
    create: function (req, res) {
        UserModel.findOne({username: req.body.holder}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.render('token/addtoken', { boxId: req.body.postboxId, warning: "User doesn't exist!"});
            }

            var token = new TokenModel({
                postboxId : req.body.postboxId,
                dateAdded : Date.now(),
                dateExpiry : req.body.expiration,
                userId : user._id,
                name : req.body.name
            });
    
            token.save(function (err, token) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating token',
                        error: err
                    });
                }
    
                return res.redirect('/token/'+req.body.postboxId);
            });
        });
    },

    /**
     * tokenController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        TokenModel.findOne({_id: id}, function (err, token) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting token',
                    error: err
                });
            }

            if (!token) {
                return res.status(404).json({
                    message: 'No such token'
                });
            }

            token.dateExpiry = req.body.expiration ? req.body.expiration : token.dateExpiry;
			token.name = req.body.name ? req.body.name : token.name;

            token.save(function (err, token) {
                if (err) {
                    return res.status(500).json({
                         message: 'Error when updating token.',
                         error: err
                    });
                }
    
                return res.redirect('/token/' + token.postboxId);
            });
        });
    },

    /**
     * tokenController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        var postboxId = req.params.postboxId;

        TokenModel.findByIdAndRemove(id, function (err, token) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the token.',
                    error: err
                });
            }

            return res.redirect('/token/'+ postboxId);
        });
    },

    removeOther: function (req, res) {
        var id = req.params.id;

        TokenModel.findByIdAndRemove(id, function (err, token) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the token.',
                    error: err
                });
            }

            return res.redirect('/postbox/show');
        });
    },

    showAddToken: function (req, res) {
        res.render('token/addtoken',{ boxId: req.params.id });
    },

    edit: function (req, res) {
        var id = req.params.id;

        TokenModel.findOne({_id: id}).populate('userId').exec(function (err, token) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting token.',
                    error: err
                });
            }

            if (!token) {
                return res.status(404).json({
                    message: 'No such token'
                });
            }

            return res.render('token/edittoken', token);
        });
    }
};
