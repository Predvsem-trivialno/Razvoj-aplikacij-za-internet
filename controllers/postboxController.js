var PostboxModel = require('../models/postboxModel.js');
var AccesslogModel = require('../models/accesslogModel.js');
var TokenModel = require('../models/tokenModel.js');

/**
 * postboxController.js
 *
 * @description :: Server-side logic for managing postboxs.
 */
module.exports = {

    mobileList: function (req, res) {
        PostboxModel.find({ownerId: req.body.userId}, function (err, postbox) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting postboxes.',
                    error: err
                });
            }
            return res.json(data);
        });
    },

    list: function (req, res) {
        data = [];
        TokenModel.find({userId: req.session.userId}).sort({dateExpiry: -1}).exec(function (err, tokens) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting tokens.',
                    error: err
                });
            }
            data.tokens=tokens;
            PostboxModel.find({ownerId: req.session.userId}, function (err, postbox) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting postboxes.',
                        error: err
                    });
                } else if(postbox.length!=0){
                    postbox.forEach( el => {
                        AccesslogModel.find({postboxId: el.postboxId}, function (err, accesslogs) {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Error when getting accesslogs.',
                                    error: err
                                });
                            }
                            el.accessCount = accesslogs.length;
                            TokenModel.find({postboxId: el.postboxId}, function (err, boxTokens) {
                                if (err) {
                                    return res.status(500).json({
                                        message: 'Error when getting boxTokens.',
                                        error: err
                                    });
                                }
                                el.tokenCount = boxTokens.length;
                                if(postbox.indexOf(el)==postbox.length-1){
                                    data.postbox=postbox;
                                    return res.render('postbox/showboxes', data);
                                }
                            });
                        });
                    });
                } else {
                    return res.render('postbox/showboxes',data);
                }
            });
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
            location : [req.body.location,req.body.location2],
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
            return res.redirect('/user/profile');
        });
    },

    open: function (req, res) {
        var box = req.body.postboxId
        var user = req.body.userId
        var success = req.body.success
        var date = Date.now()
        PostboxModel.findOne({_id: box}, function (err, postbox) {
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

            if(user == postbox.ownerId){       //Se avtomatsko odpre
                AccesslogModel.create
                return res.json(postbox);
            } else {                                        //Preveri med dostopne žetone, če uporabnik ima dovoljenje za paketnik
                TokenModel.find({postboxId: postbox.postboxId}, function(err, tokens) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting access tokens.',
                            error: err
                        });
                    }
        
                    if (!tokens) {
                        return res.status(403).json({
                            message: 'You do not have access to this postbox.'
                        });
                    }

                    tokens.forEach( el => {
                        if(user == el.userId){
                            return res.json(postbox);
                        }
                        if(tokens.indexOf(el)==tokens.length-1){
                            return res.status(403).json({
                                message: 'You do not have access to this postbox.'
                            });
                        }
                    });
                });
            }
        });
    },

    /**
     * postboxController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        var location = [req.body.location,req.body.location2];

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
            postbox.name = req.body.name ? req.body.name : postbox.name;
            postbox.location = location ? location : postbox.location;
			
            postbox.save(function (err, postbox) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating postbox.',
                        error: err
                    });
                }

                return res.redirect('/postbox/show');
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

            return res.redirect('/postbox/show');
        });
    },

    add: function (req, res) {
        res.render('postbox/addpostbox');
    }, 

    edit: function (req, res) {
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

            return res.render('postbox/editpostbox', postbox);
        });
    }
};
