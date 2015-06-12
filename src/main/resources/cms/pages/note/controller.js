var stk = require('stk/stk');
var menu = require('menu');
var util = require('utilities');

exports.get = function(req) {
	
	var content = execute('portal.getContent');	
	var site = execute('portal.getSite');
	
	var randomnumber= (Math.floor(Math.random()*11) % 4 );
		
	var params = { 
		mainRegion: content.page.regions['main'],
		content: content,
		message: "Hello pewpew",
		title: site._name,
		randomnumber: randomnumber
	}
	var view = resolve('note.html');
	
	return {
		body: execute('thymeleaf.render', {view: view, model: params}),
		contentType: 'text/html' 
	};
}; 