var AccesslogModel = require('../models/accesslogModel.js');

/**
 * accesslogController.js
 *
 * @description :: Server-side logic for managing accesslogs.
 */
module.exports = {

    /**
     * accesslogController.list()
     */
    list: function (req, res) {
        AccesslogModel.find({openedBy: id}, function (err, accesslogs) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting accesslog.',
                    error: err
                });
            }

            return res.json(accesslogs);
        });
    },

    /**
     * accesslogController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        AccesslogModel.findOne({_id: id}, function (err, accesslog) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting accesslog.',
                    error: err
                });
            }

            if (!accesslog) {
                return res.status(404).json({
                    message: 'No such accesslog'
                });
            }

            return res.json(accesslog);
        });
    },

    /**
     * accesslogController.create()
     */
    create: function (req, res) {
        var accesslog = new AccesslogModel({
			postboxId : req.body.postboxId,
			dateOpened : req.body.dateOpened,
			openedBy : req.body.openedBy,
			success : req.body.success
        });

        accesslog.save(function (err, accesslog) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating accesslog',
                    error: err
                });
            }

            return res.status(201).json(accesslog);
        });
    },

    /**
     * accesslogController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        AccesslogModel.findOne({_id: id}, function (err, accesslog) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting accesslog',
                    error: err
                });
            }

            if (!accesslog) {
                return res.status(404).json({
                    message: 'No such accesslog'
                });
            }

            accesslog.postboxId = req.body.postboxId ? req.body.postboxId : accesslog.postboxId;
			accesslog.dateOpened = req.body.dateOpened ? req.body.dateOpened : accesslog.dateOpened;
			accesslog.openedBy = req.body.openedBy ? req.body.openedBy : accesslog.openedBy;
			accesslog.success = req.body.success ? req.body.success : accesslog.success;
			
            accesslog.save(function (err, accesslog) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating accesslog.',
                        error: err
                    });
                }

                return res.json(accesslog);
            });
        });
    },

    /**
     * accesslogController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        AccesslogModel.findByIdAndRemove(id, function (err, accesslog) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the accesslog.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
