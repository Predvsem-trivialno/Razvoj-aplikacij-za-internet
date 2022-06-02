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
        data = [];
        AccesslogModel.find({postboxId: req.params.id}).populate('openedBy').exec(function (err, accesslogs) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting accesslog.',
                    error: err
                });
            }
            data.accesslogs = accesslogs;
            data.id = req.params.id;
            return res.render('accesslog/showaccesses', data);
        });
    },

    mobileLogList: function (req, res) {
        AccesslogModel.find({postboxId: req.body.boxId}).populate('openedBy').exec(function (err, accesslogs) {
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
     * accesslogController.create()
     */
    create: function (req, res) {
        var accesslog = new AccesslogModel({
			postboxId : req.body.postboxId,
			dateOpened : Date.now(),
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
