var stk = require('stk/stk');
var util = require('utilities');

exports.get = function(req){
	
		
    var component = execute('portal.getComponent');
	var content = execute('content.getChildren', {
	    key: '/shd/notes',
	    start: 0,
	    count: 1000,
	    sort: '_modifiedTime ASC'
	});
	
	//var config = component.config;
	var urlParams = req.params;
	
	var query = "";
	if( urlParams.q ){
		stk.log(urlParams.q);
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
	
	stk.log(result);
	
	if( result.contents.length == 0){
		result = content;
	}
	
	var notes = new Array();
	
	for( var i = 0; i < content.contents.length; i++ ){
		var data = content.contents[i].data;
		
		var date = new Date( content.contents[i].createdTime );
        date = util.getFormattedDate(date);
        
        data.pubDate = date;
		notes.push(data);
	}
	

	
	var params = {
		notes: notes
	};
	
	var view = resolve('note-list.html');
	
	return stk.view.render(view, params);
	
}
