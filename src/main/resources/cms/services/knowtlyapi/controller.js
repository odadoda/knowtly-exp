var stk  = require('stk/stk');
var util = require('utilities');
var markdown = require('markdown');

/**************************
*	GET: get what?
*   views, search results, 
****************************/
exports.get = function( req ){
    
    var urlParams = req.params;
    
    var actionUrl = execute('portal.serviceUrl', {
    		service: 'knowtlyapi'
    	});
	
	
	var viewFile = urlParams.view;
	var action = urlParams.action; // [search, view]
	var q = urlParams.q;
	
    //  from the java plugin
	//var something = execute("knowtly.hello", {"name": "BOOM"});
    var view, param;
    
    // show note editor
    if( urlParams.view == 'new' && urlParams.contentType != '' ){
        
        view = resolve('views/new-' + urlParams.contentType + '.html');    
        param = {
            actionUrl: actionUrl
            
        };
    
    
    // search with searchblox    
    } else if( urlParams.view == 'searchblox' && urlParams.contentType == 'result') {
        
        var view = resolve('../../parts/note-list/note-list.html');
        var site = execute('portal.getSite');
        var serviceUrl = execute('portal.serviceUrl', {
            service: 'searchblox'
        });
        
        var param = {
            actionUrl: actionUrl,
            serviceUrl: serviceUrl    
        }
    
    
    // else search content in enonic      
	} else {
    	
    	// get tags
    	var aggregationResult = execute('content.query', {
    		start: 0,
    		count: 0,
    		sort: 'createdTime DESC',
    		contentTypes: [module.name + ":note"],
    		
    		aggregations: {
    	        tags: {
    	            terms: {
    	                field: "data.tags",
    	                order: "_count desc",
    	                size: 50
    	            }
    	        }
            
        }	});
    	
    	//  iterate and collect desired data
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
    
    	view = resolve('../../parts/note-commandline/note-commandline.html');
	}
	
	return stk.view.render(view, param);	
};



/**************************
*	POST 
*   new notes,
****************************/
exports.post = function( req ){
		
	var urlParams = req.formParams;
	var site = execute('portal.getSite');
    
    // get logged in user	
	var userResult = execute('content.getChildren', {
    	key: site._path + '/users'
	});
	
	var view;
	
	//  check if user is logged in
/*	if( Integer.parseInt(userResult.total) == 0 ){
	    
	    view = resolve('log-in.html');
	    
	} else {*/
    	if( urlParams.create == 'note' ){
            
            //create new 'note'
            var result = execute('content.create', {
                name: urlParams.title,
                displayName: urlParams.title,
                contentType: module.name + ':note',
                parentPath: site._path + '/notes',
                breanch: 'master',
                data: {
                    title: urlParams.title,
                    text: '<div>' + urlParams.preface + '</div>',
                    tags: urlParams.tags.split(",")
                }
            });
            
            var content = execute('portal.getContent');
            return {
                redirect: execute('portal.pageUrl', {
                    path: content._path
                })
            };
        
    	} else { 
        	
            // else get content
        	var query = "";
        	
        	if( urlParams.q ){
        		query = 'fulltext("data.title", "' + urlParams.q + '", "AND") OR ngram("data.tags", "' + urlParams.q + '", "AND")'; 
        	}
        	
        	var result = execute('content.query', {
        		start: 0,
        		count: 100,
        		sort: 'createdTime DESC',
        		contentTypes: [module.name + ":note"],
        		query: query
        	});
        	
        	var notes = new Array();
        	
        	for( var i = 0; i < result.contents.length; i++ ){
        		var data = result.contents[i].data;
        		
        		var date = new Date( result.contents[i].createdTime );
                date = util.getFormattedDate(date);
                data.markdownParsedBody = markdown.markdown.parse(data.text);
                data.pubDate = date;
                data.url = execute('portal.pageUrl', {
            		path: result.contents[i]._path
                });
        		notes.push(data);
        	}
        	
        	var param = {
        		notes: notes,
        		requestid: urlParams.requestid
        	}	
        	
        	view = resolve('../../parts/note-list/note-list.html');
    	}
	//}
	
	return stk.view.render(view, param);
	
};