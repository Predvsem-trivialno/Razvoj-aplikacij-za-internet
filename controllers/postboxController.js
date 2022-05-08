var PostboxModel = require('../models/postboxModel.js');

/**
 * postboxController.js
 *
 * @description :: Server-side logic for managing postboxs.
 */
module.exports = {

    /**
     * postboxController.list()
     */
    list: function (req, res) {
        PostboxModel.find(function (err, postboxs) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting postbox.',
                    error: err
                });
            }

            return res.json(postboxs);
        });
    },

    /**
     * postboxController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PostboxModel.findOne({_id: id}, function (err, postbox) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting postbox.',
                    error: err
                });
            }

            if (!postbox) {
                return res.status(404).json({
                    message: 'No such postbox'
                });
            }

            return res.json(postbox);
        });
    },

    /**
     * postboxController.create()
     */
    create: function (req, res) {
        var postbox = new PostboxModel({
			postboxId : req.body.postboxId,
			ownerId : req.session.userId,
			canCreateKeys : false,
			dateAdded : Date.now()
        });

        postbox.save(function (err, postbox) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating postbox',
                    error: err
                });
            }

            //return res.status(201).json(postbox);
            return res.redirect('/');
        });
    },

    /**
     * postboxController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PostboxModel.findOne({_id: id}, function (err, postbox) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting postbox',
                    error: err
                });
            }

            if (!postbox) {
                return res.status(404).json({
                    message: 'No such postbox'
                });
            }

            postbox.postboxId = req.body.postboxId ? req.body.postboxId : postbox.postboxId;
			postbox.ownerId = req.body.ownerId ? req.body.ownerId : postbox.ownerId;
			postbox.canCreateKeys = req.body.canCreateKeys ? req.body.canCreateKeys : postbox.canCreateKeys;
			postbox.dateAdded = req.body.dateAdded ? req.body.dateAdded : postbox.dateAdded;
			
            postbox.save(function (err, postbox) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating postbox.',
                        error: err
                    });
                }

                return res.json(postbox);
            });
        });
    },

    /**
     * postboxController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PostboxModel.findByIdAndRemove(id, function (err, postbox) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the postbox.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    add: function (req, res) {
        res.render('postbox/addpostbox');
    },

    showBoxes: function (req, res) {
        res.render('postbox/showboxes')
    }
};
