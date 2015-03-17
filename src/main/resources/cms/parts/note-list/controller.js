var stk = require('stk/stk');
var util = require('utilities');

exports.get = function(req){
	
    var component = execute('portal.getComponent');
	var currentContent = execute('portal.getContent');
	var config = component.config;
	var urlParams = req.params;

	var query = "";
	if( urlParams.q ){
		query = 'fulltext("data.title", "' + urlParams.q + '", "AND") OR fulltext("data.tags", "' + urlParams.q + '", "AND")';
	}
	
	
	var result = execute('content.query', {
		start: 0,
		count: 1000,
		sort: 'createdTime DESC',
		contentTypes: [
			"com.enonic.xp.modules.knowlty.knowtly:note" 
			],
		query: query
	});
	
	
	var notes = new Array();
	
	for( var i = 0; i < result.contents.length; i++ ){
		var data = result.contents[i].data;
		
		var date = new Date( result.contents[i].createdTime );
        date = util.getFormattedDate(date);
        
        data.pubDate = date;
		stk.log(data);				
		notes.push(data);
	}
	

	
	var params = {
		notes: notes
	};
	
	var view = resolve('note-list.html');
	
	return stk.view.render(view, params);
	
}
