var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var postboxSchema = new Schema({
	'postboxId' : String,
	'ownerId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'User'
	},
	'canCreateKeys' : Boolean,
	'dateAdded' : Date
});

var PostBox = mongoose.model('postbox', postboxSchema);
module.exports = PostBox;
