var PostboxModel = require('../models/postboxModel.js');
var AccesslogModel = require('../models/accesslogModel.js');

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
        data = [];
        PostboxModel.find(function (err, postbox) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting postbox.',
                    error: err
                });
            } else {
                postbox.forEach( el => {
                    AccesslogModel.find({postboxId: el.postboxId}, function (err, accesslogs) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when getting accesslogs.',
                                error: err
                            });
                        }
                        el.accessCount = accesslogs.length;
                        if(postbox.indexOf(el)==postbox.length-1){
                            data = [];
                            data.postbox=postbox;
                            console.log(data);
                            return res.render('postbox/showboxes', data);
                        }
                    });
                });
            }
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
            name : req.body.name,
            location : req.body.location,
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

    open: function (req, res) {
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

            if(req.body.openerId == postbox.ownerId){       //Se avtomatsko odpre
                AccesslogModel.create
                return res.json(postbox);
            } else {                                        //Preveri med dostopne žetone, če uporabnik ima dovoljenje za paketnik
                
            }
            
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
    }
};
