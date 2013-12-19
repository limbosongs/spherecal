var mongoose = require('mongoose')

var schema = mongoose.Schema({ 
	name: 'string', 
	creator: 'string',
	adminList: 'string',
	userList: 'string',
	description: 'string',
	location: 'string',
	type: 'string',	
	createdDate: 'date'
	});

var Sphere = mongoose.model('Sphere', schema);

module.exports = Sphere;
