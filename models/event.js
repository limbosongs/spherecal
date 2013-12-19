var mongoose = require('mongoose')

var schema = mongoose.Schema({ 
	name: 'string',
	address: 'string',
	startsTime: 'string',
	endTime: 'string',
	time_zone: 'string',
	location: 'string',
	html_url: 'string',
	rsvp_url: 'string',
	description: 'string',
	photoUrl: 'string',
	active_flag: 'string',
	invitedUsers: 'string',
	invitedSpheres: 'string',
	created_at: 'Date'
	});

var Event = mongoose.model('Event', schema);

module.exports = Event;
