var mongoose = require('mongoose')

var schema = mongoose.Schema({ 
	oauthID: 'number', 
	name: 'string', 
	provider: 'string'});

var User = mongoose.model('User', schema);

module.exports = User;
