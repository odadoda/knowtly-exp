var stk = require('stk/stk');
var menu = require('menu');
var util = require('utilities');

exports.get = function(req) {
	
	var content = execute('portal.getContent');	
	var site = execute('portal.getSite');
	
	stk.log(site.moduleConfigs[module.name]);
	
		
	var params = { 
    	colorScheme: site.moduleConfigs[module.name].colorscheme,
		mainRegion: content.page.regions['main'],
		content: content,
		message: "Hello pewpew",
		title: site._name
	}
	
	
	
	var view = resolve('note.html');
	
	return {
		body: execute('thymeleaf.render', {view: view, model: params}),
		contentType: 'text/html' 
	};
}; 