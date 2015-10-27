var libs = {
     util: require('/lib/enonic/util/util'),
     content: require('/lib/xp/content'),
     thymeleaf: require('/lib/xp/thymeleaf'),
     portal: require('/lib/xp/portal')
}

var months = ['January', 'Fabruary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


/**************************
*	GET
****************************/
exports.get = function( req ){
    libs.util.log('~~ get ~~');
    var urlParams = req.params;
	var actionUrl = libs.portal.componentUrl({
    		component: 'main/0'
    	});
	
    //  from the java plugin
	//var something = execute("knowtly.hello", {"name": "BOOM"});
    var view, param;
    
    if( urlParams.view == 'new' && urlParams.contentType != '' ){
        
        view = resolve('new-' + urlParams.contentType + '.html');    
        param = {
            actionUrl: actionUrl,
            tinymceurl: libs.portal.assetUrl({
                          path: 'js/tinymce/tinymce.min.js',
                          theme : "advanced"

                        })
        };
        
	}else {
    	
    	
    	// get tags
    	var aggregationResult = libs.content.query({
    		start: 0,
    		count: 0,
    		sort: 'createdTime DESC',
    		contentTypes: [app.name + ":note"],
    		
    		aggregations: {
    	        tags: {
    	            terms: {
    	                field: "data.tags",
    	                order: "_count desc",
    	                size: 50
    	            }
    	        }
            
        }	});
    	
    	var tags = new Array();
    	for( var i = 0; i < aggregationResult.total; i++ ){
    		var localData = aggregationResult.aggregations.tags.buckets[i];
    		tags.push(localData);
    	}
    	
    	param = {
    		actionUrl: actionUrl,
    		tags: tags,
    		tagCount: aggregationResult.total
    	};
    
    	view = resolve('note-commandline.html');
	}
	
	return {
    	body: libs.thymeleaf.render(view, param),
    	contentType: 'text/html'
    }
};



/**************************
*	POST 
****************************/
exports.post = function( req ){ 
    libs.util.log('~~ post ~~');
	var urlParams = req.params;
	libs.util.log(req);
	
	var site = libs.portal.getSite();
	var view;
	if( typeof(urlParams.create) != 'undefined' && urlParams.create == 'note' ){
        
        libs.util.log(urlParams);
        
        var result = libs.content.create( {
            name: urlParams.title,
            displayName: urlParams.title,
            contentType: app.name + ':note',
            parentPath: site._path + '/notes',
            breanch: 'master',
            data: {
                title: urlParams.title,
                text: '<div>' + urlParams.preface + '</div>',
                tags: urlParams.tags.split(",")
            }
        });
        
        libs.util.log(result);
        
        var content = libs.portal.getContent();
        return {
            redirect: libs.portal.pageUrl({
                path: content._path
            })
        };
        
        libs.util.log('poopinator');

	}else if(typeof(urlParams.q) != 'undefined' ){
    
    	var query = "";
    	
    	if( urlParams.q ){
    		query = 'fulltext("data.title", "' + urlParams.q + '", "AND") OR ngram("data.tags", "' + urlParams.q + '", "AND")'; 
    	}
    	
    	var result = libs.content.query({
    		start: 0,
    		count: 100,
    		sort: 'createdTime DESC',
    		contentTypes: [app.name + ":note", "wpsync:wordpresspost"],
    		query: query
    	});
    	
    	
    	var notes = Array();
    	
    	for( var i = 0; i < result.hits.length; i++ ){
    		var currentContent = result.hits[i];
    		var note = {};
        	
        	if(currentContent.type == 'wpsync:wordpresspost'){
            	note.contentUrl = libs.portal.pageUrl({id: currentContent._id});
        		var date = new Date( currentContent.data.dategmt );
        	    note.markdownParsedBody = currentContent.data.content;
                note.pubDate = date.getDate() + ' ' + months[date.getMonth()]  + ' ' + date.getFullYear();
                note.title = currentContent.data.title;
                note.tags = currentContent.data.tags;            
            
            } else if(currentContent.type == app.name+':note'){
                
                var date = new Date( currentContent.createdTime );
                note.pubDate = date.getDate() + ' ' + months[date.getMonth()]  + ' ' + date.getFullYear();
                note.contentUrl = libs.portal.pageUrl({id: currentContent._id});
                note.markdownParsedBody = currentContent.data.text;
                note.title = currentContent.data.title;
                note.tags = currentContent.data.tags;
                
            }
            
            
            notes.push(note);
    	}
    	
    	var param = {
    		notes: notes,
    		requestid: urlParams.requestid
    	}	
    	
    	
        view = resolve('../note-list/note-list.html');
	}
	
	return {
    	 body: libs.thymeleaf.render(view, param),
    	 contentType: 'text/html'
	}
};