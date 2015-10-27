var libs = {
     util: require('/lib/enonic/util/util'),
     content: require('/lib/xp/content'),
     thymeleaf: require('/lib/xp/thymeleaf'),
     portal: require('/lib/xp/portal')
}

var months = ['January', 'Fabruary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

exports.get = function(req){
	
	var comp = libs.portal.getComponent();
	
	var content = Array();
	if(typeof(comp.config.notedirectory) != 'undefined' && comp.config.notedirectory.length > 0){
         content = libs.content.getChildren({
    	    key: comp.config.notedirectory,
    	    start: 0,
    	    count: 1000,
    	    sort: '_modifiedTime ASC'
    	});
	}
	
	libs.util.log("~~~~~~~");
	libs.util.log(content);
	
	var urlParams = req.params;
	
	var query = "";
	if( urlParams.q ){
    	libs.util.log(urlParams.q);
	    query = 'fulltext("data.title", "' + urlParams.q + '", "AND")'; // OR data.tags LIKE *' + urlParams.q + '*)';
    }
	
	
	var result = libs.content.query({
		start: 0,
		count: 1000,
		sort: 'data.dategmt DESC',
		contentTypes: [app.name + ":note", "wpsync:wordpresspost"],
		query: query
	});
	
	
	if( typeof(result.hits) != 'undefined' && result.hits.length > 0){
		content = result;
	}
	    
	
	var notes = new Array();
	if(typeof(content.hits) != 'undefined'){
    	libs.util.log('poop');
    	for( var i = 0; i < content.hits.length; i++ ){
        	libs.util.log(i);
            var currentContent = content.hits[i];
    		var note = {};
        	if(currentContent.type == 'wpsync:wordpresspost'){
        		var date = new Date( currentContent.data.dategmt );
                note.contentUrl = libs.portal.pageUrl({id: currentContent._id});
                
                note.markdownParsedBody = currentContent.data.content;
                note.pubDate = date.getDate() + ' ' + months[date.getMonth()]  + ' ' + date.getFullYear();
                note.title = currentContent.data.title;
                note.tags = currentContent.data.tags;            
            }else if(currentContent.type == app.name+':note'){
                
                var date = new Date( currentContent.createdTime );
                note.pubDate = date.getDate() + ' ' + months[date.getMonth()]  + ' ' + date.getFullYear();
                note.contentUrl = libs.portal.pageUrl({id: currentContent._id});
                note.markdownParsedBody = currentContent.data.text;
                note.title = currentContent.data.title;
                note.tags = currentContent.data.tags;
                
            }
    		notes.push(note);
    	}
	}
	
	
   var params = {
		notes: notes
	};
	
	libs.util.log(params);
	
	var view = resolve('note-list.html');
	
	return {
    	body: libs.thymeleaf.render(view, params),
        contentType: 'text/html'
	}
}
