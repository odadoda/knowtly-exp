var stk = require('stk/stk');
var util = require('utilities');
var markdown = require('markdown');

exports.get = function(req){
	
	// 1 get content by query or children
    var content = execute('content.getChildren', {
	    key: '/knowtly/notes',
	    start: 0,
	    count: 1000,
	    sort: '_modifiedTime ASC'
	});
	
	var stuff = execute('portal.getComponent');
	
	var urlParams = req.params;	
		
	var query = "";
	if( urlParams.q ){
		query = 'fulltext("data.title", "' + urlParams.q + '", "AND") OR data.tags LIKE *'+urlParams.q+'*)';//fulltext("data.tags", "' + urlParams.q + '", "AND")';
	}
	
	var result = execute('content.query', {
		start: 0,
		count: 1000,
		sort: 'createdTime DESC',
		contentTypes: [
			module.name + ":note"
			],
		query: query
	});
	
	
	if( result.contents.length > 0){
		content = result;
	}
	
	
	// iterate and collect desired data    
	var notes = new Array();
	
	for( var i = 0; i < content.contents.length; i++ ){
		var data = content.contents[i].data;
		
		var date = new Date( content.contents[i].createdTime );
        date = util.getFormattedDate(date);
        data.markdownParsedBody = markdown.markdown.parse(data.text);
        data.pubDate = date;
		notes.push(data);
	}
	
    var params = {
		notes: notes
	};

	var view = resolve('note-list.html');
	
	return stk.view.render(view, params);
	
}
