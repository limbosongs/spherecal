var mongoose = require('mongoose')

var schema = mongoose.Schema({ 
	name: 'string', 
	creator: 'string',
	mod_list: [{},{}], 
	admin_list: '',
	user_list: '',
	desc: 'string',
	location: 'string',
	createdDate: 'date'
	});

var Sphere = mongoose.model('Sphere', schema);

module.exports = Sphere;
