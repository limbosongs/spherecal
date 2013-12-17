var mongoose = require('mongoose')

var gender = 'male female'.split(' ')

var schema = mongoose.Schema({ 
	oauthID: 'number', 
	provider : 'string',
	name: 'string', 
	location: 'string',
	gender: { type: 'string', enum: gender }
	});

var User = mongoose.model('User', schema);

module.exports = User;
