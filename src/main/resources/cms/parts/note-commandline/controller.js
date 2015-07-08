var stk  = require('stk/stk');
var util = require('utilities');
var markdown = require('markdown');

/**************************
*	GET
****************************/
exports.get = function( req ){
    
    var urlParams = req.params;
    var site = execute('portal.getSite');
    var searchbloxApiUrl = execute('portal.serviceUrl', {
       service: 'searchblox',
       params: {test:'test'}
    });
    
    var actionUrl = execute('portal.serviceUrl', {
    		service: 'knowtlyapi'
    	});
	
    var param = {
        searchbloxUrl: searchbloxApiUrl,
        actionUrl: actionUrl
    }
    var view = resolve('note-commandline.html');
    return stk.view.render(view, param);
};



/**************************
*	POST 
****************************/
/*exports.post = function( req ){
		
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
	    
	} else {*//*
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
        		notes.push(data);
        	}
        	
        	var param = {
        		notes: notes,
        		requestid: urlParams.requestid
        	}	
        	
        	view = resolve('../note-list/note-list.html');
    	}
	//}
	
	return stk.view.render(view, param);
	
};*/