var PostboxModel = require('../models/postboxModel.js');
var AccesslogModel = require('../models/accesslogModel.js');
var TokenModel = require('../models/tokenModel.js');

const NodeGeocoder = require('node-geocoder');
const mongoose = require('mongoose');

const options = {
  provider: 'locationiq',
  apiKey: 'pk.4de90d24c9dcf87e488bb84dcc4da58f',
  format: null
};

const geocoder = NodeGeocoder(options);

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
        TokenModel.find({userId: req.session.userId}).sort({dateExpiry: -1}).lean().exec(function (err, tokens) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting tokens.',
                    error: err
                });
            }
            data.tokens=tokens;
            PostboxModel.find({ownerId: req.session.userId}).lean().exec(function (err, postbox) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting postboxes.',
                        error: err
                    });
                } else if(postbox.length!=0){
                    postbox.forEach( el => {
                        AccesslogModel.find({postboxId: el.postboxId}).lean().exec(function (err, accesslogs) {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Error when getting accesslogs.',
                                    error: err
                                });
                            }
                            el.accessCount = accesslogs.length;
                            TokenModel.find({postboxId: el.postboxId}).lean().exec(function (err, boxTokens) {
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

    open: function (req, res) {                     //takes postboxId as the postbox number, user is mongodb userId
        var box = req.body.postboxId
        var u = mongoose.Types.ObjectId(req.body.openedBy)
        console.log(req.body)
        PostboxModel.findOne({postboxId: box}).exec(function (err, postbox) {
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
            console.log(typeof(u))
            console.log(typeof(postbox.ownerId))
            console.log(u)
            console.log(postBox.ownerId)
            if(u == postbox.ownerId){       //Se avtomatsko odobri
                return res.json(postbox);
            } else {                                        //Preveri med dostopne žetone, če uporabnik ima dovoljenje za paketnik
                TokenModel.find({postboxId: box}, function(err, tokens) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting access tokens.',
                            error: err
                        });
                    }
        
                    if (tokens.length==0) {
                        return res.status(403).json({
                            message: 'You do not have access to this postbox.'
                        });
                    }
                    tokens.forEach( el => {
                        if(u == el.userId){
                            console.log("test inside")
                            if(el.dateExpiry<Date.now()){
                                return res.status(403).json({message: 'Your access token for this box has expired.'});
                            } else {
                                return res.json(postbox);
                            }
                        }
                        console.log("test outside")
                        if(tokens.indexOf(el)==tokens.length-1){
                            console.log("test last element")
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
