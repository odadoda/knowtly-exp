var stk  = require('stk/stk');
var util = require('utilities');


exports.get = function( req ){
	var actionUrl = execute('portal.componentUrl', {
		component: 'main/0'
	});
	
	// get tags
	var tags = execute('content.query',{
		contentType: [
			"base:tag"
		]
	});
	
	stk.log('....');
	stk.log(tags);	
	
	var param = {
		pewpew: "pewpew",
		actionUrl: actionUrl,
		tags: tags,
		tagCount: 0
	};
	var view = resolve('note-search.html');
	
	return stk.view.render(view, param);	
};


exports.post = function( req ){
	
	
	
	var urlParams = req.formParams;
	
	
	var query = "";
	
	if( urlParams.q ){
		stk.log("inside q: " + urlParams.q);
		query = 'fulltext("data.title", "' + urlParams.q + '", "AND") OR fulltext("data.tags", "' + urlParams.q + '", "AND")';
	}
	
	
	var result = execute('content.query', {

		start: 0,
		count: 1000,
		sort: 'createdTime DESC',
		contentTypes: [
				"com.enonic.xp.modules.knowlty.knowtly-exp:note" 
			],
		query: query
	});
	
	
	var notes = new Array();
	
	for( var i = 0; i < result.contents.length; i++ ){
		var data = result.contents[i].data;
		
		var date = new Date( result.contents[i].createdTime );
        date = util.getFormattedDate(date);
        
        data.pubDate = date;
		notes.push(data);
	}
	
	var param = {
		notes: notes
	}	
	
	var view = resolve('../note-list/note-list.html');
	
	return stk.view.render(view, param);
	
};