var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var accesslogSchema = new Schema({
	'postboxId' : String,
	'dateOpened' : Date,
	'openedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'success' : Boolean
});

module.exports = mongoose.model('accesslog', accesslogSchema);
