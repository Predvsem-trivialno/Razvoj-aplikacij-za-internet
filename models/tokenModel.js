var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var tokenSchema = new Schema({
	'postboxId' : String,
	'dateAdded' : Date,
	'dateExpiry' : Date,
	'userId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'name' : String
});

var Token = mongoose.model('token', tokenSchema);
module.exports = Token;
