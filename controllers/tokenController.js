var TokenModel = require('../models/tokenModel.js');

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
        TokenModel.find(function (err, tokens) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting token.',
                    error: err
                });
            }

            return res.json(tokens);
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
        var token = new TokenModel({
			boxId : req.body.boxId,
			dateAdded : req.body.dateAdded,
			dateExpiry : req.body.dateExpiry,
			userId : req.body.userId,
			name : req.body.name
        });

        token.save(function (err, token) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating token',
                    error: err
                });
            }

            return res.status(201).json(token);
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

            token.boxId = req.body.boxId ? req.body.boxId : token.boxId;
			token.dateAdded = req.body.dateAdded ? req.body.dateAdded : token.dateAdded;
			token.dateExpiry = req.body.dateExpiry ? req.body.dateExpiry : token.dateExpiry;
			token.userId = req.body.userId ? req.body.userId : token.userId;
			token.name = req.body.name ? req.body.name : token.name;
			
            token.save(function (err, token) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating token.',
                        error: err
                    });
                }

                return res.json(token);
            });
        });
    },

    /**
     * tokenController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        TokenModel.findByIdAndRemove(id, function (err, token) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the token.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
